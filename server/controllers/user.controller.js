import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching all users:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create a user
export const createUser = async (req, res) => {
  const { user_id, email, username, first_name, last_name, phoneNo, role } =
    req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: user_id },
    });

    if (existingUser) {
      return res.status(200).json({ message: "User already exists" });
    }

    const newUser = await prisma.user.create({
      data: {
        id: user_id,
        email,
        name: username || `${first_name || ""} ${last_name || ""}`.trim(),
        password: "", // Set empty initially or generate if needed
        phoneNo: phoneNo || null,
        role: role || "BUYER",
        emailVerified: true,
      },
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error storing user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
