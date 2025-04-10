import { Request, Response } from 'express';
import { getAllTemplates, createNewTemplate } from '../services/template.service';

export const getTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await getAllTemplates();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: (error instanceof Error) ? error.message : 'An unknown error occurred' });
  }
};

export const createTemplate = async (req: Request, res: Response) => {
  try {
    const template = await createNewTemplate(req.body);
    res.status(201).json(template);
  } catch (error) {
    res.status(400).json({ message: (error instanceof Error) ? error.message : 'An unknown error occurred' });
  }
};