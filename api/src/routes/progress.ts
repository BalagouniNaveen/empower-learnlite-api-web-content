import { Router } from "express";
import { prisma } from "../db";

const r = Router();

r.get("/:userId", async (req, res) => {
  const rows = await prisma.progress.findMany({ where: { userId: req.params.userId } });
  res.json(rows);
});

export default r;
