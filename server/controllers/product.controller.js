import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSellerProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const products = await prisma.product.findMany({
      where: {
        sellerId: id,
      },
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json("internal error");
  }
};

export const getAll = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ "internal error": "erroir" });
  }
};

// Get products currently in auction
export const getAuctionProduct = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        auctionStartTime: { lte: new Date() },
        auctionEndTime: { gt: new Date() },
      },
      orderBy: { auctionStartTime: "asc" },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching auction products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get future products (auction not started yet)
export const getFutureProduct = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        auctionStartTime: { gt: new Date() },
      },
      orderBy: { auctionStartTime: "asc" },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching future products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      basePrice,
      categoryId,
      description,
      auctionStartTime,
      auctionEndTime,
      sellerId,
      location,
    } = req.body;

    if (
      !name ||
      !basePrice ||
      !categoryId ||
      !auctionStartTime ||
      !auctionEndTime
    ) {
      return res.status(400).json({
        message:
          "Name, base price, category, auction start and end time are required.",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        basePrice,
        description,
        auctionStartTime: new Date(auctionStartTime),
        auctionEndTime: new Date(auctionEndTime),
        sellerId: sellerId || null,
        categoryId,
        location,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get single product by ID
export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found", id });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const {
    name,
    basePrice,
    description,
    location,
    categoryId,
    auctionStartTime,
    auctionEndTime,
  } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: parseInt(productId) },
      data: {
        name,
        basePrice,
        description,
        location,
        categoryId,
        auctionStartTime: auctionStartTime
          ? new Date(auctionStartTime)
          : undefined,
        auctionEndTime: auctionEndTime ? new Date(auctionEndTime) : undefined,
      },
    });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await prisma.product.delete({
      where: { id: parseInt(productId) },
    });

    res.status(200).json({ message: "Product deleted", product });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
