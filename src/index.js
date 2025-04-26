// import express from "express";
// import cors from "cors";
// import "dotenv/config";

// import authRoutes from "./routes/authRoutes.js";
// import bookRoutes from "./routes/bookRoutes.js";

// import { connectDB } from "./lib/db.js";

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.json());
// app.use(cors());

// app.use("/api/auth",authRoutes);
// app.use("/api/books",bookRoutes);

// app.listen(PORT, () => {
//     console.log(`Server is on port ${PORT}..`);
//     connectDB();
// });

import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

import { connectDB } from "./lib/db.js";
import { createServer } from "@vercel/node"; 
// Import Vercel's serverless handler

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

// Connect to the database before handling requests
connectDB();

// Export the serverless handler for Vercel
export default createServer(app);
