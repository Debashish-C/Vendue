import express from "express";
import "dotenv/config";
const app = express();
import UserRoute from "./routes/user.routes.js";
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is starting on port ${PORT}`);
});

app.use("/user", UserRoute);
