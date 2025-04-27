import express from 'express';
import cloudinary from '../lib/cloudinary.js';
import Book from '../models/Book.js';
import protectRoute from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, image, rating } = req.body;

    if (!title || !image || !caption || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //upload the image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    //save the book to the database
    const newBook = new Book({
      title,
      caption,
      image: imageUrl,
      rating,
      user: req.user._id,
    });

    await newBook.save();

    res.status(201).json(newBook);

  } catch (error) {
    console.log("Error in creating book", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/", protectRoute, async (req, res) => {
  try {

    const page = req.query.page || 1;
    const limit = req.query.limit || 2;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    const totalBooks = await Book.countDocuments();

    res.send({
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });

  } catch (error) {
    console.log("Error in getting books route", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/user", protectRoute, async (req, res) => {
  try{

    const books = await Book.find({ user: req.user._id }).sort({createdAt: -1});
    res.json(books);

  }catch (error) {
    console.log("Error in getting user books", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", protectRoute, async (req, res) => {
  try {

    const book = await Book.findById(req.params.id);
    if (!book)
      return res.status(404).json({ message: "Book not found" });

    //check if the user is the creator of the book
    if (book.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "You are not authorized to delete this book" });

    //delete the image from cloudinary
    if (book.image && book.image.includes("cloudinary")) {
      try {

        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);

      } catch (error) {
        console.log("Error in deleting image from cloudinary", deleteError);
      }
    }

    await book.deleteOne();

    res.json({ message: "Book deleted successfully" });

  } catch (error) {
    console.log("Error in deleting book", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;