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


app.use("/warehouse", verify, routes.warehouseRouter);
app.use("/province&city", verify, routes.provinceCityRouter);
app.use("/history", verify, routes.stockHistory);
app.use("/shoes", routes.shoeRoutes);
app.use("/categories", routes.categoryRoutes);
app.use("/brands", routes.brandRoutes);
app.use("/shoeimages", routes.shoeimageRoutes);

app.use("/address", verify, router.addressRouter);
app.use("/warehouse", verify, router.warehouseRouter);
app.use("/province&city", verify, router.provinceCityRouter);
app.use("/history", verify, router.stockHistory);


app.use("/category", express.static(`${__dirname}/public/category`));
app.use("/brand", express.static(`${__dirname}/public/brand`));
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
