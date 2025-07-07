import dotenv from 'dotenv';

import Root from '@/core/root';

(async () => {
  dotenv.config();
  await Root.init();
})();
