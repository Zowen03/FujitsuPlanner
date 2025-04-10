import express from 'express';
import apiRouter from './api/routes';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use('/api', apiRouter);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});