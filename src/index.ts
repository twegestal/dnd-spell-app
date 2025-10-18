import dotenv from 'dotenv';
import { createServer } from './server.js';

dotenv.config();

const server = createServer();
const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
