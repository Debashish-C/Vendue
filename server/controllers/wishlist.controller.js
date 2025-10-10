import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get wishlist for a user
export const getWishList = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: "Missing user_id" });
  }

  try {
    const wishlist = await prisma.user.findUnique({
      where: { id: parseInt(user_id) },
      select: {
        interests: {
          select: {
            id: true,
            name: true,
            products: true, // optional, include product info if needed
          },
        },
      },
    });

    res.status(200).json(wishlist?.interests || []);
  } catch (error) {
    console.error("Internal Error", error);
    res.status(500).json({ message: "Error fetching wishlist" });
  }
};

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  const { user_id, product_id } = req.body;

  if (!user_id || !product_id) {
    return res.status(400).json({ message: "Missing user_id or product_id" });
  }

  try {
    // Connect user and product in UserInterests relation
    await prisma.user.update({
      where: { id: parseInt(user_id) },
      data: {
        interests: {
          connect: { id: parseInt(product_id) }, // Assuming product id matches category/product relation
        },
      },
    });

    res.status(201).json({ message: "Product added to wishlist!" });
  } catch (error) {
    console.error("Error adding to wishlist", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  const { user_id, product_id } = req.body;

  if (!user_id || !product_id) {
    return res.status(400).json({ message: "Missing user_id or product_id" });
  }

  try {
    await prisma.user.update({
      where: { id: parseInt(user_id) },
      data: {
        interests: {
          disconnect: { id: parseInt(product_id) },
        },
      },
    });

    res.status(200).json({ message: "Removed from wishlist." });
  } catch (error) {
    console.error("Error removing from wishlist", error);
    res.status(500).json({ message: "Server error" });
  }
};
