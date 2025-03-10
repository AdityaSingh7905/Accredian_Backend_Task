const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const referralRouter = require("./routes/referral.router");

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use("/api/referrals", referralRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
