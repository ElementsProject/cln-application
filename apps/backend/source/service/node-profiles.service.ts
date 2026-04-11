import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { NodeProfile, NodeProfilesConfig } from '../models/node-profile.type.js';
import { logger } from '../shared/logger.js';
import { APP_CONSTANTS } from '../shared/consts.js';
import { parseEnvFile } from '../shared/utils.js';

const PROFILES_FILE = './node-profiles.json';

export class NodeProfilesService {
  private configPath: string;

  constructor(configPath?: string) {
    this.configPath = configPath || PROFILES_FILE;
  }

  generateProfileId(pubkey: string, wsHost: string, wsPort: number): string {
    const hash = crypto.createHash('sha256');
    hash.update(pubkey + wsHost + String(wsPort));
    return hash.digest('hex').substring(0, 12);
  }

  loadProfiles(): NodeProfilesConfig {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, 'utf-8');
        const config: NodeProfilesConfig = JSON.parse(data);
        return config;
      }
    } catch (error: any) {
      logger.error('Error loading node profiles: ' + (error.message || error));
    }
    return { version: 1, activeProfileId: null, profiles: [] };
  }

  saveProfiles(config: NodeProfilesConfig): void {
    try {
      const dir = path.dirname(path.resolve(this.configPath));
      const tmpFile = path.join(dir, '.node-profiles.tmp.' + process.pid + '.json');
      fs.writeFileSync(tmpFile, JSON.stringify(config, null, 2), 'utf-8');
      fs.renameSync(tmpFile, path.resolve(this.configPath));
      logger.info('Node profiles saved successfully');
    } catch (error: any) {
      logger.error('Error saving node profiles: ' + (error.message || error));
      throw error;
    }
  }

  migrateFromCommandoEnv(): NodeProfilesConfig | null {
    if (fs.existsSync(this.configPath)) {
      return null; // Already migrated
    }
    const commandoEnvPath = APP_CONSTANTS.LIGHTNING_VARS_FILE;
    if (!fs.existsSync(commandoEnvPath)) {
      return null;
    }
    try {
      const envVars = parseEnvFile(commandoEnvPath);
      const pubkey = envVars.LIGHTNING_PUBKEY || '';
      const rune = envVars.LIGHTNING_RUNE || '';
      if (!pubkey || !rune) {
        logger.warn(
          'Cannot migrate from .commando-env: missing LIGHTNING_PUBKEY or LIGHTNING_RUNE',
        );
        return null;
      }
      const wsHost = APP_CONSTANTS.LIGHTNING_WS_HOST;
      const wsPort = APP_CONSTANTS.LIGHTNING_WS_PORT;
      const profileId = this.generateProfileId(pubkey, wsHost, wsPort);
      const profile: NodeProfile = {
        id: profileId,
        label: 'Default Node',
        pubkey,
        rune,
        wsHost,
        wsPort,
        lastSeen: Date.now(),
      };
      const config: NodeProfilesConfig = {
        version: 1,
        activeProfileId: profileId,
        profiles: [profile],
      };
      this.saveProfiles(config);
      logger.info('Migrated .commando-env to node-profiles.json with profile id: ' + profileId);
      return config;
    } catch (error: any) {
      logger.error('Error migrating from .commando-env: ' + (error.message || error));
      return null;
    }
  }

  addProfile(params: {
    label?: string;
    pubkey: string;
    rune: string;
    wsHost: string;
    wsPort: number;
    network?: string;
    alias?: string;
    blockheight?: number;
  }): NodeProfile {
    const config = this.loadProfiles();
    const profileId = this.generateProfileId(params.pubkey, params.wsHost, params.wsPort);

    const existing = config.profiles.find(p => p.id === profileId);
    if (existing) {
      // Update existing profile
      existing.label = params.label || existing.label;
      existing.rune = params.rune;
      existing.network = params.network || existing.network;
      existing.alias = params.alias || existing.alias;
      existing.blockheight = params.blockheight || existing.blockheight;
      existing.lastSeen = Date.now();
      this.saveProfiles(config);
      return existing;
    }

    const profile: NodeProfile = {
      id: profileId,
      label: params.label || params.alias || 'Node ' + profileId.substring(0, 6),
      pubkey: params.pubkey,
      rune: params.rune,
      wsHost: params.wsHost,
      wsPort: params.wsPort,
      network: params.network,
      alias: params.alias,
      blockheight: params.blockheight,
      lastSeen: Date.now(),
    };

    config.profiles.push(profile);

    // If this is the first profile, make it active
    if (config.profiles.length === 1) {
      config.activeProfileId = profile.id;
    }

    this.saveProfiles(config);
    logger.info('Added node profile: ' + profile.id + ' (' + profile.label + ')');
    return profile;
  }

  removeProfile(profileId: string): void {
    const config = this.loadProfiles();
    const index = config.profiles.findIndex(p => p.id === profileId);
    if (index === -1) {
      throw new Error('Profile not found: ' + profileId);
    }
    config.profiles.splice(index, 1);

    if (config.activeProfileId === profileId) {
      config.activeProfileId = config.profiles.length > 0 ? config.profiles[0].id : null;
    }

    this.saveProfiles(config);
    logger.info('Removed node profile: ' + profileId);
  }

  setActiveProfile(profileId: string): NodeProfile {
    const config = this.loadProfiles();
    const profile = config.profiles.find(p => p.id === profileId);
    if (!profile) {
      throw new Error('Profile not found: ' + profileId);
    }
    config.activeProfileId = profileId;
    this.saveProfiles(config);
    logger.info('Set active profile to: ' + profileId);
    return profile;
  }

  getActiveProfile(): NodeProfile | null {
    const config = this.loadProfiles();
    if (!config.activeProfileId) {
      return null;
    }
    return config.profiles.find(p => p.id === config.activeProfileId) || null;
  }

  getProfile(profileId: string): NodeProfile | null {
    const config = this.loadProfiles();
    return config.profiles.find(p => p.id === profileId) || null;
  }

  listProfiles(): NodeProfile[] {
    const config = this.loadProfiles();
    return config.profiles;
  }

  /**
   * Scan platform-specific paths for CLN .commando-env files.
   * Returns an array of parsed candidate profiles (not yet verified).
   */
  discoverCommandoEnvFiles(): Array<{
    pubkey: string;
    rune: string;
    wsHost: string;
    wsPort: number;
    sourcePath: string;
  }> {
    const candidates: Array<{
      pubkey: string;
      rune: string;
      wsHost: string;
      wsPort: number;
      sourcePath: string;
    }> = [];
    const searchPaths: string[] = [];
    const platform = os.platform();

    if (platform === 'linux') {
      // Common CLN data dirs on Linux
      searchPaths.push(path.join(os.homedir(), '.lightning'), '/var/lib/cln');
      // Check for cln-* directories in /var/lib/
      try {
        const varLibEntries = fs.readdirSync('/var/lib/');
        for (const entry of varLibEntries) {
          if (entry.startsWith('cln-') || entry.startsWith('cln_')) {
            searchPaths.push(path.join('/var/lib', entry));
          }
        }
      } catch {
        /* /var/lib may not exist or not be readable */
      }
    } else if (platform === 'darwin') {
      searchPaths.push(
        path.join(os.homedir(), 'Library', 'Application Support', 'lightning'),
        path.join(os.homedir(), '.lightning'),
      );
    } else if (platform === 'win32') {
      searchPaths.push(
        path.join(os.homedir(), '.lightning'),
        path.join(os.homedir(), 'AppData', 'Local', 'lightning'),
      );
    }

    // Also check current working directory and one level up
    searchPaths.push('.', '..');

    for (const searchDir of searchPaths) {
      try {
        const resolvedDir = path.resolve(searchDir);
        if (!fs.existsSync(resolvedDir)) continue;

        // Check for .commando-env directly in this dir
        const commandoPath = path.join(resolvedDir, '.commando-env');
        if (fs.existsSync(commandoPath)) {
          const parsed = this.parseCommandoEnvCandidate(commandoPath);
          if (parsed) {
            candidates.push(parsed);
          }
        }

        // Check subdirectories (network dirs like bitcoin/, testnet/, regtest/)
        const stat = fs.statSync(resolvedDir);
        if (stat.isDirectory()) {
          const entries = fs.readdirSync(resolvedDir);
          for (const entry of entries) {
            const subPath = path.join(resolvedDir, entry, '.commando-env');
            try {
              if (fs.existsSync(subPath)) {
                const parsed = this.parseCommandoEnvCandidate(subPath);
                if (parsed) {
                  candidates.push(parsed);
                }
              }
            } catch {
              /* skip unreadable entries */
            }
          }
        }
      } catch {
        /* skip unreadable paths */
      }
    }

    // Deduplicate by pubkey+host+port
    const seen = new Set<string>();
    return candidates.filter(c => {
      const key = c.pubkey + c.wsHost + c.wsPort;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private parseCommandoEnvCandidate(
    filePath: string,
  ): { pubkey: string; rune: string; wsHost: string; wsPort: number; sourcePath: string } | null {
    try {
      const envVars = parseEnvFile(filePath);
      const pubkey = envVars.LIGHTNING_PUBKEY || '';
      const rune = envVars.LIGHTNING_RUNE || '';
      if (!pubkey || !rune) return null;

      // Use env vars from the file if available, fall back to app defaults
      const wsHost = envVars.LIGHTNING_WS_HOST || APP_CONSTANTS.LIGHTNING_WS_HOST;
      const wsPort = envVars.LIGHTNING_WS_PORT
        ? parseInt(envVars.LIGHTNING_WS_PORT, 10)
        : APP_CONSTANTS.LIGHTNING_WS_PORT;

      return { pubkey, rune, wsHost, wsPort, sourcePath: filePath };
    } catch {
      return null;
    }
  }
}
