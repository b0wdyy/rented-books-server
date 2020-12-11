const express = require("express");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const multer = require("multer");
const bookModel = require("../models/book");
const checkAuth = require("../middlewares/checkAuth");
const { saveBook, saveBookWithImage } = require("../utils/mongo");
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

// TODO checkAuth nog toevoegen
router.get("/", async (_req, res) => {
    const books = await bookModel.find();
    res.json({ data: books });
});

// TODO checkAuth nog toevoegen
router.post("/", async (req, res) => {
    const upload = multer({ storage }).single("image");

    upload(req, res, err => {
        if (err) return res.json({ msg: err });
        if (req.file) {
            const file = req.file;
            const path = file.path;

            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            });

            cloudinary.uploader.upload(
                path,
                { public_id: `api/${file.filename.split(".")[0]}` },
                async (err, image) => {
                    if (err) return res.json({ msg: err });
                    try {
                        console.log(`${image.url} uploaded to cloudinary`);
                        fs.unlinkSync(path);

                        saveBookWithImage(req, res, image);
                    } catch (e) {
                        res.json(e);
                    }
                }
            );
        } else {
            try {
                saveBook(req, res);
            } catch (e) {
                res.json(e);
            }
        }
    });
});

router.get("/:id", checkAuth, async (req, res) => {
    const bookId = req.params.id;
    const book = await bookModel.findById(bookId, "title description").exec();
    res.status(200).json({ book });
});

router.delete("/:id", checkAuth, async (req, res) => {
    const bookId = req.params.id;
    await bookModel.findByIdAndDelete(bookId);
    res.status(204).json({ msg: `Book with ${bookId} deleted.` });
});

module.exports = router;
