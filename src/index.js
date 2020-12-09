const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const booksRouter = require("../router/booksRouter");
const userRouter = require("../router/userRouter");
require("dotenv").config();

const main = async () => {
    await mongoose
        .connect(
            `mongodb+srv://admin:${process.env.MONGO_PASS}@cluster0.rxgj8.mongodb.net/api?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true,
            }
        )
        .then(() => console.log("connection successful"));

    const app = express();

    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(morgan("dev"));

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    app.use("/api/v1", booksRouter);
    app.use("/api/v1", userRouter);

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
        console.log(`server listening on http://localhost:${PORT}`);
    });
};

main();
