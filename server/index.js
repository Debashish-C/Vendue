import express from "express";
import "dotenv/config";
import cors from "cors";
import UserRoute from "./routes/user.routes.js";
import ProductRoute from "./routes/product.routes.js";
import { query } from "./db/db.js";

const app = express();

app.use(cors());

app.get("/test-db", async (req, res) => {
  try {
    const result = await query("SELECT NOW()");
    res.json({
      status: "success",
      message: "Database connected successfully!",
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.use("/user", UserRoute);
app.use("/product", ProductRoute);

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
