const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createReferral() {
  const referral = await prisma.referral.create({
    data: {
      referrerName: "John Doe",
      referrerEmail: "john@example.com",
      referrerPhone: "9876543210",
      refereeName: "Jane Smith",
      refereeEmail: "jane@example.com",
      refereePhone: "8765432109",
      course: "Full Stack Development",
    },
  });
  console.log("Referral Created:", referral);
}

createReferral();
