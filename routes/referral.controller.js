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

    // Check if an EXACT referral already exists
    const existingReferral = await prisma.referral.findFirst({
      where: {
        referrerName,
        referrerEmail,
        referrerPhone,
        refereeName,
        refereeEmail,
        refereePhone,
        course: courseName,
      },
    });

    // If an exact match is found, do nothing (but return success)
    if (existingReferral) {
      return res
        .status(200)
        .json({ message: "Referral already exists. No action taken..." });
    }

    // Otherwise, save the new referral
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
    console.error("Referral Submission Error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again!" });
  } finally {
    await prisma.$disconnect(); // Close Prisma client to prevent connection leaks
  }
};

module.exports = {
  postReferral,
};
