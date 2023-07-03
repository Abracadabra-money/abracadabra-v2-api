import { join } from 'path';

const { env } = process;

// App
export const APP_PORT = parseInt(env.APP_PORT);
export const APP_VERSION = env.npm_package_version;

// Logger
export const LOG_FOLDER_PATH = join(process.cwd(), '/logs');

// Blockchain
export const { FTM_RPC, ETH_RPC } = env;

export const { COINGECKO_API_KEY } = env;
