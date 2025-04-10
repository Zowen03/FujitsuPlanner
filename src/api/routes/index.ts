import { Router } from 'express';
import { getTemplates, createTemplate } from '../controllers/template.controller';

const router = Router();

// Template routes
router.get('/templates', getTemplates);
router.post('/templates', createTemplate);

export default router;