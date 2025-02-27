const express = require("express");
const { postReferral } = require("../routes/referral.controller");

const referralRouter = express.Router();

referralRouter.post("/", postReferral);

module.exports = referralRouter;
