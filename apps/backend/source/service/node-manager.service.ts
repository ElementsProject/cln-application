import { NodeProfile } from '../models/node-profile.type.js';
import { NodeProfilesService } from './node-profiles.service.js';
import { LightningService } from './lightning.service.js';
import { logger } from '../shared/logger.js';

export class NodeManager {
  private profilesService: NodeProfilesService;
  private activeService: LightningService | null = null;
  private activeProfile: NodeProfile | null = null;
  /** Fallback legacy service when no profiles exist but .commando-env works */
  private legacyService: LightningService | null = null;

  constructor() {
    this.profilesService = new NodeProfilesService();
  }

  /**
   * Initialize the node manager:
   * 1. Try to load existing profiles config
   * 2. If none exists, try migrating from .commando-env
   * 3. If an active profile is set, connect to it
   * 4. If no profiles at all, try legacy .commando-env path (direct LightningService constructor)
   */
  async initialize(): Promise<void> {
    // Step 1: Load or migrate profiles
    let config = this.profilesService.loadProfiles();

    if (config.profiles.length === 0) {
      // Step 2: Try migration
      const migrated = this.profilesService.migrateFromCommandoEnv();
      if (migrated) {
        config = migrated;
      }
    }

    // Step 3: If active profile set, connect
    if (config.activeProfileId) {
      const profile = config.profiles.find(p => p.id === config.activeProfileId);
      if (profile) {
        try {
          this.activeService = LightningService.createFromProfile(profile);
          this.activeProfile = profile;

          // Try to update profile info via getinfo
          try {
            const info: any = await this.activeService.call('getinfo', []);
            profile.alias = info.alias || profile.alias;
            profile.network = info.network || profile.network;
            profile.blockheight = info.blockheight || profile.blockheight;
            profile.lastSeen = Date.now();
            if (profile.label === 'Default Node' && info.alias) {
              profile.label = info.alias;
            }
            this.profilesService.saveProfiles(config);
            this.activeProfile = profile;
          } catch (infoErr: any) {
            logger.warn(
              'Could not fetch getinfo for active profile: ' + (infoErr.message || infoErr),
            );
          }

          logger.info('Connected to active profile: ' + profile.id + ' (' + profile.label + ')');
          return;
        } catch (err: any) {
          logger.error(
            'Failed to connect to active profile ' + profile.id + ': ' + (err.message || err),
          );
          // Fall through to legacy path
        }
      }
    }

    // Step 4: No profiles or failed to connect — try legacy path
    if (config.profiles.length === 0) {
      try {
        logger.info('No node profiles found, trying legacy .commando-env path');
        this.legacyService = new LightningService();
        logger.info('Legacy LightningService initialized successfully');
      } catch (err: any) {
        logger.error('Legacy LightningService initialization failed: ' + (err.message || err));
        throw err;
      }
    }
  }

  /**
   * Discover CLN nodes on the system by scanning platform-specific paths.
   * For each discovered .commando-env, probe the node to verify and get info.
   */
  async discoverNodes(): Promise<NodeProfile[]> {
    const candidates = this.profilesService.discoverCommandoEnvFiles();
    const discovered: NodeProfile[] = [];

    for (const candidate of candidates) {
      const profileId = this.profilesService.generateProfileId(
        candidate.pubkey,
        candidate.wsHost,
        candidate.wsPort,
      );

      // Check if we already have this profile
      const existing = this.profilesService.getProfile(profileId);

      // Build a temporary profile for probing
      const tempProfile: NodeProfile = {
        id: profileId,
        label: existing?.label || 'Discovered Node',
        pubkey: candidate.pubkey,
        rune: candidate.rune,
        wsHost: candidate.wsHost,
        wsPort: candidate.wsPort,
        lastSeen: Date.now(),
      };

      try {
        const info = await LightningService.probe(tempProfile);
        tempProfile.alias = info.alias;
        tempProfile.network = info.network;
        tempProfile.blockheight = info.blockheight;
        if (tempProfile.label === 'Discovered Node' && info.alias) {
          tempProfile.label = info.alias;
        }
        discovered.push(tempProfile);
      } catch (err: any) {
        logger.warn(
          'Could not probe node at ' +
            candidate.wsHost +
            ':' +
            candidate.wsPort +
            ' (from ' +
            candidate.sourcePath +
            '): ' +
            (err.message || err),
        );
        // Still include it as discovered but without probe info
        discovered.push(tempProfile);
      }
    }

    return discovered;
  }

  /**
   * Switch to a different node profile.
   * Disconnects current connection, connects to the new profile, saves config.
   */
  async switchNode(profileId: string): Promise<NodeProfile> {
    const profile = this.profilesService.getProfile(profileId);
    if (!profile) {
      throw new Error('Profile not found: ' + profileId);
    }

    // Disconnect current
    if (this.activeService) {
      this.activeService.disconnect();
      this.activeService = null;
    }
    this.legacyService = null;

    // Connect to new profile
    this.activeService = LightningService.createFromProfile(profile);
    this.activeProfile = profile;
    this.profilesService.setActiveProfile(profileId);

    // Update profile info
    try {
      const info: any = await this.activeService.call('getinfo', []);
      profile.alias = info.alias || profile.alias;
      profile.network = info.network || profile.network;
      profile.blockheight = info.blockheight || profile.blockheight;
      profile.lastSeen = Date.now();
      const config = this.profilesService.loadProfiles();
      const idx = config.profiles.findIndex(p => p.id === profileId);
      if (idx >= 0) {
        config.profiles[idx] = profile;
        this.profilesService.saveProfiles(config);
      }
      this.activeProfile = profile;
    } catch (err: any) {
      logger.warn(
        'Could not fetch getinfo after switching to profile ' +
          profileId +
          ': ' +
          (err.message || err),
      );
    }

    logger.info('Switched to node profile: ' + profileId + ' (' + profile.label + ')');
    return profile;
  }

  /**
   * Get the active LightningService instance.
   * Throws if no connection is available.
   */
  getActiveService(): LightningService {
    if (this.activeService) {
      return this.activeService;
    }
    if (this.legacyService) {
      return this.legacyService;
    }
    throw new Error('No active Lightning node connection. Please connect to a node first.');
  }

  getActiveProfile(): NodeProfile | null {
    return this.activeProfile;
  }

  listProfiles(): NodeProfile[] {
    return this.profilesService.listProfiles();
  }

  async addProfile(params: {
    label?: string;
    pubkey: string;
    rune: string;
    wsHost: string;
    wsPort: number;
  }): Promise<NodeProfile> {
    // Probe the node to get info before adding
    const tempProfile: NodeProfile = {
      id: this.profilesService.generateProfileId(params.pubkey, params.wsHost, params.wsPort),
      label: params.label || 'New Node',
      pubkey: params.pubkey,
      rune: params.rune,
      wsHost: params.wsHost,
      wsPort: params.wsPort,
    };

    let probeInfo: { alias: string; network: string; blockheight: number } | null = null;
    try {
      const info = await LightningService.probe(tempProfile);
      probeInfo = { alias: info.alias, network: info.network, blockheight: info.blockheight };
    } catch (err: any) {
      logger.warn('Could not probe node during addProfile: ' + (err.message || err));
    }

    const profile = this.profilesService.addProfile({
      label: params.label,
      pubkey: params.pubkey,
      rune: params.rune,
      wsHost: params.wsHost,
      wsPort: params.wsPort,
      network: probeInfo?.network,
      alias: probeInfo?.alias,
      blockheight: probeInfo?.blockheight,
    });

    return profile;
  }

  async removeProfile(profileId: string): Promise<void> {
    // If removing the active profile, disconnect first
    if (this.activeProfile && this.activeProfile.id === profileId) {
      if (this.activeService) {
        this.activeService.disconnect();
        this.activeService = null;
      }
      this.activeProfile = null;
    }

    this.profilesService.removeProfile(profileId);

    // If there are remaining profiles and active was removed, connect to new active
    const config = this.profilesService.loadProfiles();
    if (config.activeProfileId) {
      const newActive = config.profiles.find(p => p.id === config.activeProfileId);
      if (newActive) {
        try {
          this.activeService = LightningService.createFromProfile(newActive);
          this.activeProfile = newActive;
        } catch (err: any) {
          logger.error(
            'Failed to connect to new active profile after removal: ' + (err.message || err),
          );
        }
      }
    }
  }

  getProfilesService(): NodeProfilesService {
    return this.profilesService;
  }
}
