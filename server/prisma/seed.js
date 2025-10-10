import { PrismaClient, Role, ProductStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create categories first
  const categories = await prisma.category.createManyAndReturn({
    data: [
      { name: "Electronics" },
      { name: "Fashion" },
      { name: "Home & Kitchen" },
      { name: "Books" },
      { name: "Sports" },
      { name: "Automotive" },
      { name: "Art & Collectibles" },
      { name: "Jewelry" },
    ],
  });

  // Create users
  const users = await prisma.user.createManyAndReturn({
    data: [
      {
        name: "Raj Sharma",
        email: "raj.sharma@example.com",
        password: "$2b$10$examplehashedpassword1",
        phoneNo: "+919876543210",
        role: Role.SELLER,
      },
      {
        name: "Priya Patel",
        email: "priya.patel@example.com",
        password: "$2b$10$examplehashedpassword2",
        phoneNo: "+919876543211",
        role: Role.BUYER,
      },
      {
        name: "Amit Kumar",
        email: "amit.kumar@example.com",
        password: "$2b$10$examplehashedpassword3",
        phoneNo: "+919876543212",
        role: Role.SELLER,
      },
      {
        name: "Neha Gupta",
        email: "neha.gupta@example.com",
        password: "$2b$10$examplehashedpassword4",
        phoneNo: "+919876543213",
        role: Role.BUYER,
      },
      {
        name: "Vikram Singh",
        email: "vikram.singh@example.com",
        password: "$2b$10$examplehashedpassword5",
        phoneNo: "+919876543214",
        role: Role.ADMIN,
      },
      {
        name: "Anjali Reddy",
        email: "anjali.reddy@example.com",
        password: "$2b$10$examplehashedpassword6",
        phoneNo: "+919876543215",
        role: Role.SELLER,
      },
      {
        name: "Rahul Mehta",
        email: "rahul.mehta@example.com",
        password: "$2b$10$examplehashedpassword7",
        phoneNo: "+919876543216",
        role: Role.BUYER,
      },
      {
        name: "Sneha Iyer",
        email: "sneha.iyer@example.com",
        password: "$2b$10$examplehashedpassword8",
        phoneNo: "+919876543217",
        role: Role.BUYER,
      },
    ],
  });

  // Create products
  const products = await prisma.product.createManyAndReturn({
    data: [
      {
        name: "Samsung Galaxy S23",
        description: "Latest Samsung smartphone with 128GB storage",
        basePrice: 54999,
        auctionStartTime: new Date("2024-01-15T10:00:00Z"),
        auctionEndTime: new Date("2024-01-20T18:00:00Z"),
        status: ProductStatus.ACTIVE,
        location: "Mumbai, Maharashtra",
        sellerId: users[0].id,
        categoryId: categories[0].id,
      },
      {
        name: "Handwoven Silk Saree",
        description: "Traditional Banarasi silk saree with zari work",
        basePrice: 12500,
        auctionStartTime: new Date("2024-01-16T09:00:00Z"),
        auctionEndTime: new Date("2024-01-21T17:00:00Z"),
        status: ProductStatus.ACTIVE,
        location: "Varanasi, Uttar Pradesh",
        sellerId: users[2].id,
        categoryId: categories[1].id,
      },
      {
        name: "Instant Pot Duo",
        description: "7-in-1 multi-functional pressure cooker",
        basePrice: 8999,
        auctionStartTime: new Date("2024-01-14T11:00:00Z"),
        auctionEndTime: new Date("2024-01-19T20:00:00Z"),
        status: ProductStatus.ACTIVE,
        location: "Delhi, NCR",
        sellerId: users[5].id,
        categoryId: categories[2].id,
      },
      {
        name: "The India Story by Bimal Jalan",
        description: "Hardcover edition, excellent condition",
        basePrice: 450,
        auctionStartTime: new Date("2024-01-17T08:00:00Z"),
        auctionEndTime: new Date("2024-01-22T16:00:00Z"),
        status: ProductStatus.ACTIVE,
        location: "Kolkata, West Bengal",
        sellerId: users[0].id,
        categoryId: categories[3].id,
      },
      {
        name: "Yonex Badminton Racket",
        description: "Carbon fiber racket with full cover",
        basePrice: 3200,
        auctionStartTime: new Date("2024-01-13T12:00:00Z"),
        auctionEndTime: new Date("2024-01-18T19:00:00Z"),
        status: ProductStatus.ACTIVE,
        location: "Hyderabad, Telangana",
        sellerId: users[2].id,
        categoryId: categories[4].id,
      },
      {
        name: "Bose Headphones 700",
        description: "Noise cancelling wireless headphones",
        basePrice: 28999,
        auctionStartTime: new Date("2024-01-18T10:30:00Z"),
        auctionEndTime: new Date("2024-01-23T21:00:00Z"),
        status: ProductStatus.ACTIVE,
        location: "Bangalore, Karnataka",
        sellerId: users[5].id,
        categoryId: categories[0].id,
      },
      {
        name: "Traditional Gold Earrings",
        description: "22k gold jhumkas with kundan work",
        basePrice: 18500,
        auctionStartTime: new Date("2024-01-19T09:15:00Z"),
        auctionEndTime: new Date("2024-01-24T18:30:00Z"),
        status: ProductStatus.ACTIVE,
        location: "Jaipur, Rajasthan",
        sellerId: users[0].id,
        categoryId: categories[7].id,
      },
      {
        name: "Handmade Pottery Set",
        description: "Blue pottery tea set, 12 pieces",
        basePrice: 3500,
        auctionStartTime: new Date("2024-01-20T11:45:00Z"),
        auctionEndTime: new Date("2024-01-25T17:45:00Z"),
        status: ProductStatus.ACTIVE,
        location: "Jaipur, Rajasthan",
        sellerId: users[2].id,
        categoryId: categories[6].id,
      },
      {
        name: "MacBook Air M2",
        description: "2023 model, 8GB RAM, 256GB SSD",
        basePrice: 89999,
        auctionStartTime: new Date("2024-01-21T13:00:00Z"),
        auctionEndTime: new Date("2024-01-26T22:00:00Z"),
        status: ProductStatus.ACTIVE,
        location: "Chennai, Tamil Nadu",
        sellerId: users[5].id,
        categoryId: categories[0].id,
      },
      {
        name: "Designer Kurti Set",
        description: "Printed kurti with dupatta and leggings",
        basePrice: 1999,
        auctionStartTime: new Date("2024-01-22T14:20:00Z"),
        auctionEndTime: new Date("2024-01-27T19:15:00Z"),
        status: ProductStatus.ACTIVE,
        location: "Ahmedabad, Gujarat",
        sellerId: users[0].id,
        categoryId: categories[1].id,
      },
    ],
  });

  // Create product images
  await prisma.productImage.createMany({
    data: [
      {
        url: "https://example.com/images/galaxy-s23-1.jpg",
        productId: products[0].id,
      },
      {
        url: "https://example.com/images/saree-1.jpg",
        productId: products[1].id,
      },
      {
        url: "https://example.com/images/instant-pot-1.jpg",
        productId: products[2].id,
      },
      {
        url: "https://example.com/images/book-1.jpg",
        productId: products[3].id,
      },
      {
        url: "https://example.com/images/racket-1.jpg",
        productId: products[4].id,
      },
      {
        url: "https://example.com/images/headphones-1.jpg",
        productId: products[5].id,
      },
      {
        url: "https://example.com/images/earrings-1.jpg",
        productId: products[6].id,
      },
      {
        url: "https://example.com/images/pottery-1.jpg",
        productId: products[7].id,
      },
      {
        url: "https://example.com/images/macbook-1.jpg",
        productId: products[8].id,
      },
      {
        url: "https://example.com/images/kurti-1.jpg",
        productId: products[9].id,
      },
    ],
  });

  // Create bids
  await prisma.bid.createMany({
    data: [
      { amount: 56999, bidderId: users[1].id, productId: products[0].id },
      { amount: 58999, bidderId: users[3].id, productId: products[0].id },
      { amount: 13500, bidderId: users[6].id, productId: products[1].id },
      { amount: 9500, bidderId: users[7].id, productId: products[2].id },
      { amount: 550, bidderId: users[1].id, productId: products[3].id },
      { amount: 3500, bidderId: users[3].id, productId: products[4].id },
      { amount: 29999, bidderId: users[6].id, productId: products[5].id },
      { amount: 19500, bidderId: users[7].id, productId: products[6].id },
      { amount: 92000, bidderId: users[1].id, productId: products[8].id },
      { amount: 2200, bidderId: users[3].id, productId: products[9].id },
    ],
  });

  // Create winnings
  await prisma.winning.createMany({
    data: [
      {
        productId: products[0].id,
        winnerId: users[3].id,
        productReceived: true,
        paymentReceived: true,
        buyerFeedback: "Great product, fast shipping!",
        sellerFeedback: "Prompt payment, smooth transaction",
      },
    ],
  });

  // Create messages
  await prisma.message.createMany({
    data: [
      {
        content: "Is the phone unlocked?",
        senderId: users[1].id,
        receiverId: users[0].id,
        productId: products[0].id,
      },
      {
        content: "Yes, it works with all carriers",
        senderId: users[0].id,
        receiverId: users[1].id,
        productId: products[0].id,
      },
      {
        content: "What is the silk quality?",
        senderId: users[6].id,
        receiverId: users[2].id,
        productId: products[1].id,
      },
    ],
  });

  // Create user interests (categories)
  await prisma.user.update({
    where: { id: users[1].id },
    data: {
      interests: {
        connect: [{ id: categories[0].id }, { id: categories[4].id }],
      },
    },
  });

  await prisma.user.update({
    where: { id: users[3].id },
    data: {
      interests: {
        connect: [{ id: categories[1].id }, { id: categories[7].id }],
      },
    },
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
