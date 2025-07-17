#!/usr/bin/env node

import dotenv from 'dotenv';
import path from 'path';

import Root from '@/core/root';

(async () => {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  await Root.init();
})();
