const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const booksRouter = require("../router/booksRouter");
const userRouter = require("../router/userRouter");
require("dotenv").config();

const main = async () => {
    await mongoose
        .connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.rxgj8.mongodb.net/api?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true,
            }
        )
        .then(() => console.log("connection successful"))
        .catch(e => console.log(e));

    const app = express();

    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(morgan("dev"));

    app.use("/api/v1/books", booksRouter);
    app.use("/api/v1/users", userRouter);

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
        console.log(`server listening on http://localhost:${PORT}`);
    });
};

main();
