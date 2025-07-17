#!/usr/bin/env node

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import Root from '@/core/root';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  await Root.init();
})();
