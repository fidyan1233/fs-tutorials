const express = require("express");
const { dbConnection } = require("./database/dbConnection.js");

const userRouter = require("./routes/userRoutes.js");

const { config } = require("dotenv");
const cors = require("cors");
const { errorMiddleware } = require("./middlewares/error.js");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const app = express();
config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api/v1/user", userRouter);

dbConnection();

app.use(errorMiddleware);

module.exports =  app;
