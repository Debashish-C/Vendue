// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// async function main() {
//   console.log("🧹 Clearing old data...");

//   // Clear all tables — order matters due to foreign key dependencies
//   // await prisma.bid.deleteMany();
//   // await prisma.auction.deleteMany();
//   // await prisma.user.deleteMany();
//   // await prisma.category.deleteMany();

//   // console.log("✅ Old data cleared!");

//   // --- Seed Categories ---
//   console.log("🌱 Seeding categories...");
//   const categories = await prisma.category.createMany({
//     data: [
//       { name: "Electronics" },
//       { name: "Fashion" },
//       { name: "Home & Kitchen" },
//       { name: "Books" },
//       { name: "Sports" },
//       { name: "Art & Collectibles" },
//       { name: "Vehicles" },
//     ],
//   });

//   // Get categories (since createMany doesn’t return inserted records)
//   const allCategories = await prisma.category.findMany();

//   // --- Seed Users ---
//   console.log("👤 Seeding users...");
//   // const users = await prisma.user.createMany({
//   //   data: [
//   //     {
//   //       email: "buyer1@example.com",
//   //       password: "$2b$10$examplehashedpassword8",
//   //       phoneNo: "+919876543210",
//   //       role: "BUYER",
//   //     },
//   //     {
//   //       email: "buyer2@example.com",
//   //       password: "$2b$10$examplehashedpassword9",
//   //       phoneNo: "+919876543211",
//   //       role: "BUYER",
//   //     },
//   //     {
//   //       email: "seller1@example.com",
//   //       password: "$2b$10$examplehashedpassword10",
//   //       phoneNo: "+919876543212",
//   //       role: "SELLER",
//   //     },
//   //     {
//   //       email: "seller2@example.com",
//   //       password: "$2b$10$examplehashedpassword11",
//   //       phoneNo: "+919876543213",
//   //       role: "SELLER",
//   //     },
//   //   ],
//   // });

//   // Fetch all users
//   const allUsers = await prisma.user.findMany();
//   const [buyer1, buyer2] = allUsers.filter(u => u.role === "BUYER");
//   const [seller1, seller2] = allUsers.filter(u => u.role === "SELLER");

//   // --- Seed Auctions ---
//   console.log("📦 Seeding auctions...");
//   const auctions = await prisma.auction.createMany({
//     data: [
//       {
//         title: "MacBook Pro 2020",
//         description: "Lightly used MacBook Pro, 16GB RAM, 512GB SSD.",
//         startingBid: 75000,
//         categoryId: allCategories.find(c => c.name === "Electronics").id,
//         userId: seller1.id,
//       },
//       {
//         title: "Nike Air Max Shoes",
//         description: "Brand new pair of Nike shoes, size 9.",
//         startingBid: 5000,
//         categoryId: allCategories.find(c => c.name === "Fashion").id,
//         userId: seller2.id,
//       },
//       {
//         title: "Cricket Bat",
//         description: "Professional grade English willow bat.",
//         startingBid: 3000,
//         categoryId: allCategories.find(c => c.name === "Sports").id,
//         userId: seller2.id,
//       },
//     ],
//   });

//   // Fetch all auctions
//   const allAuctions = await prisma.auction.findMany();

//   // --- Seed Bids ---
//   console.log("💰 Seeding bids...");
//   await prisma.bid.createMany({
//     data: [
//       {
//         amount: 76000,
//         userId: buyer1.id,
//         auctionId: allAuctions.find(a => a.title === "MacBook Pro 2020").id,
//       },
//       {
//         amount: 77000,
//         userId: buyer2.id,
//         auctionId: allAuctions.find(a => a.title === "MacBook Pro 2020").id,
//       },
//       {
//         amount: 5200,
//         userId: buyer1.id,
//         auctionId: allAuctions.find(a => a.title === "Nike Air Max Shoes").id,
//       },
//     ],
//   });

//   console.log("✅ Database seeding complete!");
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error("❌ Error during seeding:", e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
