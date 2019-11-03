const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const morgan = require("morgan")("tiny");
const UserAccountController = require("./src/controllers/useraccount.controller");
const VendorController = require("./src/controllers/vendor.controller");
const MerchantController = require("./src/controllers/merchant.controller");
// const PointsController = require("./controllers/points.controller");
const AdminController = require("./src/controllers/admin.controller");
const TransactionController = require("./src/controllers/transaction.controller");
const OfferController = require("./src/controllers/offer.controller");
const NewsController = require("./src/controllers/news.controller");
const AnalyticsController = require("./src/controllers/analytics.controller");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const mongoose = require("mongoose");
const cors = require("cors");
const chalk = require("chalk").default;
const path = require("path");

function _bootstrapApp() {
  const app = express();

  app.use(express.static(path.join(__dirname, 'client/build')));
  
  // Initializing Middlewares
  app.use(errorHandler());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan);
  app.use(cors());
  app.use("/uploads", express.static("uploads"));

  app.use("/api/user", UserAccountController);
  app.use("/api/vendor", VendorController);
  app.use("/api/merchant", MerchantController);
  app.use("/api/admin", AdminController);
  app.use("/api/transaction", TransactionController);
  app.use("/api/offer", OfferController);
  app.use("/api/news", NewsController);
  app.use("/api/analytics", AnalyticsController);

  app.get("/api/test", (_, res) =>
    res.send({ satus: "ok", messgage: "smoke test" })
  );

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });

  return app;
}

module.exports = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect("mongodb://localhost:27017/moni", {
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(_ => {
        console.log(`[info]: ${chalk.green("Databse connected!")}`);
        resolve(_bootstrapApp());
      })
      .catch(error => {
        reject(error);
      });
  });
};
