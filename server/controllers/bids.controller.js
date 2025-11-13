import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// -------------------- PLACE BID --------------------
export const placeBid = async (req, res) => {
  const { user_id, product_id, bid_amount } = req.body;

  try {
    const bid = await prisma.bid.create({
      data: {
        amount: bid_amount,
        bidder: { connect: { id: user_id } },
        product: { connect: { id: product_id } },
      },
    });

    res.status(201).json({ message: "Bid placed successfully", bid });
  } catch (err) {
    console.error("Error placing bid:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -------------------- GET ALL BIDS FOR A PRODUCT --------------------
export const getBidsForProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const bids = await prisma.bid.findMany({
      where: { productId: Number(id) },
      orderBy:[ { amount: "desc"} ,{ createdAt : "asc" }],
      take : 3,
      include: {
        bidder: { select: { id: true, name: true, email: true } },
      },
    });

    res.json(bids);
  } catch (err) {
    console.error("Error fetching bids:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -------------------- GET USER BIDS ON A PRODUCT --------------------
export const getUserBidsOnProduct = async (req, res) => {
  const { user_id, product_id } = req.params;

  try {
    const bids = await prisma.bid.findMany({
      where: {
        bidderId: Number(user_id),
        productId: Number(product_id),
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(bids);
  } catch (err) {
    console.error("Error fetching user bids:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
