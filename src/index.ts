import mongoose from "mongoose";
import { config } from "./config/envConfig";
import http from "http";
import Logging from "./utils/logging";
import path from "path";
import { engine } from "express-handlebars";
import cors from "cors";
import route from "./routes/index.route";
import cookieParser from "cookie-parser";
import express from "express";

const app = express();

const StartServer = () => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());

  // Log the request and response
  app.use((req, res, next) => {
    Logging.info(
      `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on("finish", () => {
      Logging.info(`STATUS: [${res.statusCode}]`);
    });

    next();
  });

  // Rules for calling API
  // app.use((req, res, next) => {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  //   );

  //   if (req.method == "OPTIONS") {
  //     res.header(
  //       "Access-Control-Allow-Methods",
  //       "PUT, POST, PATCH, DELETE, GET"
  //     );
  //     return res.status(200).json({});
  //   }

  //   next();
  // });

  // Healthcheck
  app.get("/ping", (req, res, next) =>
    res.status(200).json({ hello: "world" })
  );

  // app.use("/auth", authRoute);
  app.set("view engine", "handlebars");
  app.set("views", path.join(__dirname + "/views"));
  app.engine(
    "handlebars",
    engine({
      defaultLayout: "main",
      extname: ".handlebars",
      helpers: {
        inc: function (value, options) {
          return parseInt(value) + 1;
        },
        ifEquals: function (arg1: any, arg2: any, options: any) {
          return arg1 == arg2 ? options.fn(this) : options.inverse(this);
        },
      },
    })
  );

  app.use(express.static(path.join(__dirname + "/public")));

  app.use(cookieParser());

  //Routes
  app.use("/", route);

  // Server Error
  // app.use((req, res, next) => {
  //   const error = new Error("Not found");
  //   Logging.error(error);
  //   res.status(500).json({
  //     message: error.message,
  //   });
  // });

  //Template engine

  http
    .createServer(app)
    .listen(config.port, () =>
      Logging.info(`Server is running on port ${config.port}`)
    );
};

/** Connect to Mongo */
mongoose.set("strictQuery", false);

// for debug mongodb

// mongoose.set('debug', function(col, method, query, doc) {
//   console.log('Mongoose:', col, method, query, doc);
// });
mongoose
  .connect(config.mongo_uri, { retryWrites: true, w: "majority" })
  .then(() => {
    Logging.info("Connected to Mongo");
    StartServer();
  })
  .catch((error) => Logging.error(error));
