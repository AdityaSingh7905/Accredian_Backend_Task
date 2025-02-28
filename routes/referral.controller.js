const { PrismaClient } = require("@prisma/client");
const sendReferralEmail = require("../services/gmailService");

const prisma = new PrismaClient();

const postReferral = async (req, res) => {
  try {
    const {
      referrerName,
      referrerEmail,
      referrerPhone,
      refereeName,
      refereeEmail,
      refereePhone,
      courseName,
    } = req.body;

    console.log("Incoming Referral Data:", req.body);

    // Check if all required fields are provided
    if (
      !referrerName ||
      !referrerEmail ||
      !referrerPhone ||
      !refereeName ||
      !refereeEmail ||
      !refereePhone ||
      !courseName
    ) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    try {
      // Save Referral to MySQL via Prisma
      const newReferral = await prisma.referral.create({
        data: {
          referrerName,
          referrerEmail,
          referrerPhone,
          refereeName,
          refereeEmail,
          refereePhone,
          course: courseName,
        },
      });

      // Send Referral Email
      await sendReferralEmail(
        refereeEmail,
        "You Have Been Referred!",
        `<h2>Hello ${refereeName},</h2><p>${referrerName} has referred you for the ${courseName} course.</p>`
      );

      return res.status(201).json({
        message: "Referral submitted successfully!",
        data: newReferral,
      });
    } catch (error) {
      if (error.code === "P2002") {
        // Prisma Unique Constraint Error
        return res.status(400).json({
          error: "Referrer email or referee email already exists.",
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Referral Submission Error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again!" });
  } finally {
    await prisma.$disconnect(); // Close Prisma client to prevent connection leaks
  }
};

module.exports = {
  postReferral,
};
