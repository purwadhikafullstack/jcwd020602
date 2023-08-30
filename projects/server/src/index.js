const { join } = require("path");
// require("dotenv/config");
const dotenv = require("dotenv");
dotenv.config({ path: join(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 8000;
const app = express();
// app.use(
//   cors({
//     origin: [
//       process.env.WHITELISTED_DOMAIN &&
//         process.env.WHITELISTED_DOMAIN.split(","),
//     ],
//   })
// );
app.use(cors());
app.use(express.json());
const verify = require("./middlewares/verify");
const routes = require("./routes");
const db = require("./models");
const cronJob = require("./utils/cronJob");
// db.sequelize.sync({ alter: true });
// db.sequelize.sync({ force: true });

//#region API ROUTES

// ===========================
// NOTE : Add your routes here
cronJob();
app.get("/api", (req, res) => {
  res.send(`Hello, this is my API`);
});

app.get("/api/greetings", (req, res, next) => {
  res.status(200).json({
    message: "Hello, Student !",
  });
});

app.use("/api/warehouses", verify, routes.warehouseRoutes);
app.use("/api/province&city", verify, routes.provinceCityRoutes);
app.use("/api/shoes", verify, routes.shoeRoutes);
app.use("/api/shoeSizes", verify, routes.shoeSizeRoutes);
app.use("/api/categories", verify, routes.categoryRoutes);
app.use("/api/subcategories", verify, routes.subcategoryRoutes);
app.use("/api/brands", verify, routes.brandRoutes);
app.use("/api/address", verify, routes.addressFRoutes);
app.use("/api/auth", verify, routes.userRoutes);
app.use("/api/stocks", verify, routes.stockRoutes);
app.use("/api/stockHistories", verify, routes.stockHistoryRoutes);
app.use("/api/stockMutations", verify, routes.stockMutationRoutes);

// -------------------------------------------------
app.use("/api/carts", verify, routes.cartRoutes);
app.use("/api/checkOuts", verify, routes.checkOutRoutes);
app.use("/api/orders", verify, routes.orderRoutes);

// ===========================
app.use("/api/category", express.static(`${__dirname}/public/category`));
app.use("/api/brand", express.static(`${__dirname}/public/brand`));
app.use("/api/avatar", express.static(`${__dirname}/public/avatar`));
app.use("/api/shoe", express.static(`${__dirname}/public/shoe`));
app.use(
  "/api/paymentProof",
  express.static(`${__dirname}/public/paymentProof`)
);

// not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
    res.status(500).send("Error !");
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
