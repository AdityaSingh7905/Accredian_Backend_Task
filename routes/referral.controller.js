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
    console.log(req.body);
    if (
      !referrerName ||
      !referrerEmail ||
      !referrerPhone ||
      !refereeName ||
      !refereeEmail ||
      !refereePhone ||
      !courseName
    ) {
      console.log(true);
      return res.status(400).json({ error: "All fields are required!" });
    }

    // Check if referrerEmail already exists
    const existingReferral = await prisma.referral.findUnique({
      where: { referrerEmail },
    });

    if (existingReferral) {
      return res.status(400).json({
        error: "Referrer email already exists. Please use a different email.",
      });
    }

    // Save Referral to MySQL (via Prisma)
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

    res
      .status(201)
      .json({ message: "Referral submitted successfully!", data: newReferral });
  } catch (error) {
    console.error("Referral Submission Error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again!" });
  }
};

module.exports = {
  postReferral,
};
