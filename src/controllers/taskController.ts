import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prismaClient';
import logger from '../utils/logger';

export async function listTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { status, tag, search } = req.query;

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        ...(status && { status: status as string }),
        ...(tag && { tags: { has: tag as string } }),
        ...(search && {
          OR: [
            { title: { contains: search as string, mode: 'insensitive' } },
            { description: { contains: search as string, mode: 'insensitive' } },
          ],
        }),
      },
      include: { analysis: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

export async function createTask(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { title, description, dueDate, priority, tags } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = await prisma.task.create({
      data: {
        userId,
        title: title.trim(),
        description: description?.trim(),
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'MEDIUM',
        tags: tags || [],
        status: 'TODO',
      },
    });

    logger.info(`Task created: ${task.id} by user ${userId}`);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function getTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const task = await prisma.task.findFirst({
      where: { id, userId },
      include: { analysis: true },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { title, description, dueDate, priority, status, tags } = req.body;

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(priority && { priority }),
        ...(status && { status }),
        ...(tags && { tags }),
        updatedAt: new Date(),
      },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({ where: { id } });
    logger.info(`Task deleted: ${id}`);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
