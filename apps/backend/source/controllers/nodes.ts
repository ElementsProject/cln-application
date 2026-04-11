import { Request, Response, NextFunction } from 'express';
import handleError from '../shared/error-handler.js';
import { NodeManager } from '../service/node-manager.service.js';
import { logger } from '../shared/logger.js';
import { HttpStatusCode } from '../shared/consts.js';
import { APIError } from '../models/errors.js';
import { NodeProfile } from '../models/node-profile.type.js';

/** Strip the rune field from a profile before sending to the frontend */
function sanitizeProfile(profile: NodeProfile): Omit<NodeProfile, 'rune'> & { rune?: undefined } {
  const { rune, ...safe } = profile;
  return safe;
}

export class NodesController {
  private nodeManager: NodeManager;

  constructor(nodeManager: NodeManager) {
    this.nodeManager = nodeManager;
  }

  listProfiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profiles = this.nodeManager.listProfiles();
      const activeProfile = this.nodeManager.getActiveProfile();
      res.status(200).json({
        activeProfileId: activeProfile?.id || null,
        profiles: profiles.map(sanitizeProfile),
      });
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  };

  getActiveProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = this.nodeManager.getActiveProfile();
      if (!profile) {
        return res.status(200).json({ profile: null });
      }
      res.status(200).json({ profile: sanitizeProfile(profile) });
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  };

  switchNode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { profileId } = req.body;
      if (!profileId) {
        return handleError(
          new APIError(HttpStatusCode.BAD_REQUEST, 'profileId is required'),
          req,
          res,
          next,
        );
      }
      logger.info('Switching to node profile: ' + profileId);
      const profile = await this.nodeManager.switchNode(profileId);
      res.status(200).json({ profile: sanitizeProfile(profile) });
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  };

  discoverNodes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Discovering nodes on the system');
      const discovered = await this.nodeManager.discoverNodes();
      res.status(200).json({
        profiles: discovered.map(sanitizeProfile),
      });
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  };

  addProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { label, pubkey, rune, wsHost, wsPort } = req.body;
      if (!pubkey || !rune || !wsHost || !wsPort) {
        return handleError(
          new APIError(HttpStatusCode.BAD_REQUEST, 'pubkey, rune, wsHost, and wsPort are required'),
          req,
          res,
          next,
        );
      }
      logger.info('Adding node profile for pubkey: ' + pubkey);
      const profile = await this.nodeManager.addProfile({
        label,
        pubkey,
        rune,
        wsHost,
        wsPort: Number(wsPort),
      });
      res.status(201).json({ profile: sanitizeProfile(profile) });
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  };

  removeProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      if (!id) {
        return handleError(
          new APIError(HttpStatusCode.BAD_REQUEST, 'Profile id is required'),
          req,
          res,
          next,
        );
      }
      logger.info('Removing node profile: ' + id);
      await this.nodeManager.removeProfile(id);
      res.status(204).send();
    } catch (error: any) {
      handleError(error, req, res, next);
    }
  };
}
