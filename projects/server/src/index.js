// require("dotenv/config");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const { join } = require("path");

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
// db.sequelize.sync({ alter: true });
// db.sequelize.sync({ force: true });

//#region API ROUTES

// ===========================
// NOTE : Add your routes here

app.get("/api", (req, res) => {
  res.send(`Hello, this is my API`);
});

app.get("/api/greetings", (req, res, next) => {
  res.status(200).json({
    message: "Hello, Student !",
  });
});

app.use("/api/warehouses", verify, routes.warehouseRouter);
app.use("/api/province&city", verify, routes.provinceCityRouter);
app.use("/api/histories", verify, routes.stockHistory);
app.use("/api/shoes", routes.shoeRoutes);
app.use("/api/categories", routes.categoryRoutes);
app.use("/api/brands", routes.brandRoutes);
app.use("/api/shoeimages", routes.shoeimageRoutes);
app.use("/api/address", verify, routes.addressRouter);
app.use("/api/auth", routes.userRouter);

app.use("/api/category", express.static(`${__dirname}/public/category`));
app.use("/api/brand", express.static(`${__dirname}/public/brand`));
app.use("/api/avatar", express.static(`${__dirname}/public/avatar`));
// ===========================

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
