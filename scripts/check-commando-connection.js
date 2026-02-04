import Lnmessage from 'lnmessage';
import WebSocket from 'ws';
import fs from 'fs';
import crypto from 'crypto';
import { exit } from 'process';

const LIGHTNING_VARS_FILE = process.env.LIGHTNING_VARS_FILE || `${process.cwd()}/.commando`;
const WS_PROTOCOL = process.env.LIGHTNING_WS_PROTOCOL;
const NODE_IP = process.env.LIGHTNING_WS_HOST;
const WS_PORT = process.env.LIGHTNING_WS_PORT;
let NODE_PUBKEY;
let RUNE;

if (!LIGHTNING_VARS_FILE) {
  console.error(`[ERROR - ${new Date().toISOString()}]: LIGHTNING_VARS_FILE environment variable not set`);
  exit(1);
}

try {
  const fileContent = fs.readFileSync(LIGHTNING_VARS_FILE, 'utf8');
  const lines = fileContent.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('LIGHTNING_PUBKEY=')) {
      NODE_PUBKEY = trimmedLine.split('=')[1].replace(/"/g, '');
    } else if (trimmedLine.startsWith('LIGHTNING_RUNE=')) {
      RUNE = trimmedLine.split('=')[1].replace(/"/g, '');
    }
  }
} catch (err) {
  console.error(`[ERROR - ${new Date().toISOString()}]: Failed to read file ${LIGHTNING_VARS_FILE}:`, err.message);
  exit(1);
}

if (!NODE_PUBKEY) {
  console.error(`[ERROR - ${new Date().toISOString()}]: LIGHTNING_PUBKEY not found in file`);
  exit(1);
}
if (!RUNE) {
  console.error(`[ERROR - ${new Date().toISOString()}]: LIGHTNING_RUNE not found in file`);
  exit(1);
}

class SecureWebSocket extends WebSocket {
  constructor(url) {
    const options = {};
    options.rejectUnauthorized = false;
    options.cert = fs.readFileSync(process.env.LIGHTNING_WS_CLIENT_CERT_FILE);
    options.key = fs.readFileSync(process.env.LIGHTNING_WS_CLIENT_KEY_FILE);
    super(url, options);
  }
}

if (WS_PROTOCOL === 'wss') { globalThis.WebSocket = SecureWebSocket; }

let lnmessageOptions = {
  ip: NODE_IP,
  remoteNodePublicKey: NODE_PUBKEY,
  privateKey: crypto.randomBytes(32).toString('hex'),
  wsProxy: `${WS_PROTOCOL}://${NODE_IP}:${WS_PORT}`,
  port: WS_PORT,
  logger: { info: console.log, warn: console.log, error: console.error }
}
console.log(`[INFO - ${new Date().toISOString()}]: lnMessage Options `, lnmessageOptions);

const ln = new Lnmessage(lnmessageOptions)
console.log(`[INFO - ${new Date().toISOString()}]: Initialized lnMessage`);

ln.connectionStatus$.subscribe(status => {
  if (status === 'failed') {
      console.error(`[ERROR - ${new Date().toISOString()}]: Failed to reconnect after maximum attempts`);
      exit(1);
  }
});

console.log(`[INFO - ${new Date().toISOString()}]: Connecting...`);
try {
  await ln.connect();
  console.log(`[INFO - ${new Date().toISOString()}]: Connected`);
} catch (err) {
  console.error(`[ERROR - ${new Date().toISOString()}]: Connection failed! Error:\n`, err);
  exit(1);
}

try {
  const getinfoResponse = await ln.commando({reqId: crypto.randomBytes(8).toString('hex'), method: 'getinfo', params: [], rune: RUNE});
  console.log(`[INFO - ${new Date().toISOString()}]: Connection successful! Getinfo Response:\n`, getinfoResponse);
  exit(0);
} catch (err) {
  console.error(`[ERROR - ${new Date().toISOString()}]: Connection failed! Getinfo Error:\n`, err);
  exit(1);
}
