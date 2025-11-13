import express from "express";
import "dotenv/config";
import cors from "cors";
import UserRoute from "./routes/user.routes.js";
import ProductRoute from "./routes/product.routes.js";
import CatagoryRoute from "./routes/catagory.routes.js";
import WishListRoute from "./routes/wishlist.routes.js";
import BidsRoute from "./routes/bids.routes.js";
import "./cron/auctionJob.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

app.get("/test-db", async (req, res) => {
  try {
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
app.use("/category", CatagoryRoute);
app.use("/wishlist", WishListRoute);
app.use("/bids", BidsRoute);

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



export default app;
