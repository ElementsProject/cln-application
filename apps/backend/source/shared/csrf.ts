import { Request } from 'express';
import { doubleCsrf } from 'csrf-csrf';
import { APP_CONSTANTS, SECRET_KEY } from './consts.js';

// Signed double-submit cookie
// The session cookie is already SameSite=Strict
// So this is a second layer for browsers that predate SameSite.
const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => SECRET_KEY,
  getSessionIdentifier: () => '',
  cookieName: '_csrf',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'strict',
    secure: APP_CONSTANTS.APP_PROTOCOL === 'https',
    path: '/',
  },
  getCsrfTokenFromRequest: (req: Request) => {
    const header = req.headers['x-xsrf-token'];
    return Array.isArray(header) ? header[0] : header;
  },
});

export const csrfProtection = doubleCsrfProtection;
export { generateCsrfToken };
