const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createSession = async (req, res) => {
  const { fieldId, cost, playerCount, fieldType, weather, photoUrl, date } = req.body;
  const session = await prisma.session.create({
    data: {
      fieldId,
      cost,
      playerCount,
      fieldType,
      weather,
      photoUrl,
      date: new Date(date),
      userId: req.userId
    }
  });
  res.status(201).json(session);
};

exports.getSessions = async (req, res) => {
  const sessions = await prisma.session.findMany({ where: { userId: req.userId }, include: { field: true } });
  res.json(sessions);
};
