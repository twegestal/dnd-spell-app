import dotenv from 'dotenv';
import { createServer } from './server';

dotenv.config();

const server = createServer();
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
