import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.MONGO_URI || "";

mongoose
  .connect(connectionString)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.log(err));

const app = express();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
