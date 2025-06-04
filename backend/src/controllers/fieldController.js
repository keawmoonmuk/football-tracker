const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createField = async (req, res) => {
  const { name, latitude, longitude } = req.body;
  const field = await prisma.field.create({ data: { name, latitude, longitude } });
  res.status(201).json(field);
};

exports.getFields = async (req, res) => {
  const fields = await prisma.field.findMany();
  res.json(fields);
};