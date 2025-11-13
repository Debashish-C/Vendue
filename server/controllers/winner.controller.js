
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

export const getWinner = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) return res.status(400).json({ message: "Missing productId" });

    const winner = await prisma.winning.findUnique({
      where: { productId: parseInt(productId) },
      include: {
        winner: true, // fetch winner user details if needed
        product: true, // fetch product details if needed
      },
    });

    if (!winner) return res.status(404).json({ message: "No winner yet" });

    res.status(200).json(winner);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get winner" });
  }
};
