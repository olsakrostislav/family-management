import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const groups = await prisma.group.findMany();

    const groupsWithUsernames = await Promise.all(
      groups.map(async (group: any) => {
        const productOwner = await prisma.user.findUnique({
          where: { userId: group.productOwnerUserId! },
          select: { username: true },
        });

        const projectManager = await prisma.user.findUnique({
          where: { userId: group.projectManagerUserId! },
          select: { username: true },
        });

        return {
          ...group,
          productOwnerUsername: productOwner?.username,
          projectManagerUsername: projectManager?.username,
        };
      })
    );

    res.json(groupsWithUsernames);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving groups: ${error.message}` });
  }
};
