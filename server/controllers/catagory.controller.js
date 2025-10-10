import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" }, // optional: order by id
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching auction categories:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
