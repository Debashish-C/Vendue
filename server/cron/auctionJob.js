import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Run every minute (adjust as needed)
cron.schedule("* * * * *", async () => {
  console.log("Checking ended auctions...", new Date().toISOString());

  try {
    // 1. Find all products whose auction ended and are still ACTIVE
    const endedProducts = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        auctionEndTime: {
          lte: new Date(),
        },
      },
      include: {
        bids: {
          orderBy: {
            amount: "desc", // highest bid first
          },
        },
      },
    });

    for (const product of endedProducts) {
      if (product.bids && product.bids.length > 0) {
        // There are bids, find the highest
        const highestBid = product.bids[0];

        // Create or update Winning entry
        await prisma.winning.upsert({
          where: { productId: product.id },
          update: { winnerId: highestBid.bidderId },
          create: {
            productId: product.id,
            winnerId: highestBid.bidderId,
            productReceived: false,
            paymentReceived: false,
          },
        });

        // Update product status to SOLD
        await prisma.product.update({
          where: { id: product.id },
          data: { status: "SOLD" },
        });
      } else {
        // No bids, move to Unsold
        await prisma.unsold.create({
          data: {
            productId: product.id,
            reason: "No valid bids",
            auctionStartTime: product.auctionStartTime,
            auctionEndTime: product.auctionEndTime,
            basePrice: product.basePrice,
          },
        });

        // Update product status to UNSOLD
        await prisma.product.update({
          where: { id: product.id },
          data: { status: "UNSOLD" },
        });
      }
    }
  } catch (error) {
    console.error("Error processing auctions:", error);
  }
});
