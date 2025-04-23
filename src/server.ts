import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Minimal working route
app.post('/api/templates', async (req, res) => {
  try {
    const { name, certificationId } = req.body;
    
    // Absolutely minimal data shape that Prisma will accept
    const template = await prisma.template.create({
      data: {
        name,
        certification: { connect: { id: Number(certificationId) } },
        createdBy: { connect: { id: 1 } } // Hardcoded user ID for now
      }
    });
    
    res.json(template);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create template" });
  }
});

app.listen(3000, () => console.log('Server running'));