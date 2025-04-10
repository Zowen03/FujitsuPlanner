import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllTemplates = async () => {
  return await prisma.template.findMany({
    include: { tasks: true }
  });
};

export const createNewTemplate = async (data: {
  name: string;
  certificationId: number;
  tasks: Array<{ title: string }>;
}) => {
  return await prisma.template.create({
    data: {
      name: data.name,
      certificationId: data.certificationId,
      createdById: 1, // Replace '1' with the appropriate value for createdById
      tasks: { create: data.tasks.map((task, index) => ({ ...task, sort_order: index + 1 })) }
    }
  });
};