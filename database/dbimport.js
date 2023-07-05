// import * as dotenv from "dotenv"
const dotenv = require("dotenv");
const sql = require("mssql");
dotenv.config({
  path: "../config.env",
});

const dbConfig = require("./dbconfig");
const appPool = new sql.ConnectionPool(dbConfig.sqlConfig);

const fs = require("fs");
const ProductDAO = require("../DAO/ProductDAO");
const UserDAO = require("../DAO/UserDAO");
const FeatureDAO = require("../DAO/FeatureDAO");
const RatingDAO = require("../DAO/RatingDAO");
const CartDAO = require("../DAO/CartDAO");
const SubImageDAO = require("../DAO/SubImageDAO");
const CategoryDAO = require("../DAO/CategoryDAO");
const BrandDAO = require("../DAO/BrandDAO");
const { log } = require("console");

async function importDB() {
  const PRODUCT_FILE_PATH = "../data/products.json";
  const USER_FILE_PATH = "../data/users.json";
  const FEATURE_FILE_PATH = "../data/feature.json";
  const RATING_FILE_PATH = "../data/ratings.json";
  const CART_FILE_PATH = "../data/cart.json";
  const CARTPRODUCT_FILE_PATH = "../data/cartProduct.json";
  const SUBIMAGE_FILE_PATH = "../data/subImage.json";
  const CATEGORY_FILE_PATH = "../data/category.json";
  const BRAND_FILE_PATH = "../data/brand.json";

  let products = JSON.parse(fs.readFileSync(PRODUCT_FILE_PATH, "utf-8"));
  let users = JSON.parse(fs.readFileSync(USER_FILE_PATH, "utf-8"));
  let features = JSON.parse(fs.readFileSync(FEATURE_FILE_PATH, "utf-8"));
  let ratings = JSON.parse(fs.readFileSync(RATING_FILE_PATH, "utf-8"));
  let carts = JSON.parse(fs.readFileSync(CART_FILE_PATH, "utf-8"));
  let carts_Product = JSON.parse(
    fs.readFileSync(CARTPRODUCT_FILE_PATH, "utf-8")
  );
  let imgs = JSON.parse(fs.readFileSync(SUBIMAGE_FILE_PATH, "utf-8"));
  let categorys = JSON.parse(fs.readFileSync(CATEGORY_FILE_PATH, "utf-8"));
  let brands = JSON.parse(fs.readFileSync(BRAND_FILE_PATH, "utf-8"));

  //import category
  for (let i = 0; i < categorys.length; i++) {
    let category = categorys[i];
    try {
      await CategoryDAO.addCateIfNotExists(category);
      console.log("import category --- done!");
    } catch (error) {
      throw new error("errr", category);
    }
  }
  //import brand
  for (let i = 0; i < brands.length; i++) {
    let brand = brands[i];
    try {
      await BrandDAO.addBrandIfNotExists(brand);
      console.log("import brand --- done!");
    } catch (error) {
      throw new error("errr", brand);
    }
  }
  //import product
  for (let i = 0; i < products.length; i++) {
    let product = products[i];
    try {
      await ProductDAO.addProductIfNotExisted(product);
      console.log("import product --- done!");
    } catch (error) {
      throw new error("errr", product);
    }
  }
  //import users
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    try {
      await UserDAO.addUserIfNotExisted(user);
      console.log("import user --- done!");
    } catch (error) {
      throw new error("errr", user);
    }
  }
  // import feature
  for (let i = 0; i < features.length; i++) {
    let feature = features[i];
    try {
      await FeatureDAO.addFeatureIfNotExisted(feature);
      console.log("import feature --- done!");
    } catch (Error) {
      throw new Error("errr", feature);
    }
  }

  // import rating

  for (let i = 0; i < ratings.length; i++) {
    let rating = ratings[i];

    try {
      await RatingDAO.addRatingIfNotExisted(rating);
      console.log("import rating --- done!");
    } catch (Error) {
      throw new Error("errr", rating);
    }
  }
  //import cart

  for (let i = 0; i < carts.length; i++) {
    let cart = carts[i];
    try {
      await CartDAO.addCartIfNotExisted(cart);
      console.log("import cart --- done!");
    } catch (Error) {
      throw new Error("errr", cart);
    }
  }

  for (let i = 0; i < carts_Product.length; i++) {
    let item = carts_Product[i];
    try {
      await CartDAO.addCart_ProductIfNotExisted(item);
      console.log("import carts_Product --- done!");
    } catch (Error) {
      throw new Error("errr", item);
    }
  }

  for (let i = 0; i < imgs.length; i++) {
    let img = imgs[i];
    try {
      await SubImageDAO.addSubImageIfNotExisted(img);
      console.log("import subImage --- done!");
    } catch (Error) {
      throw new Error("errr", item);
    }
  }
}

async function dbClean() {
  await FeatureDAO.clearAll();
  await RatingDAO.clearAll();
  await SubImageDAO.clearAll();
  await CartDAO.clearAllCart_Product();
  await CartDAO.clearAllCart();
  await UserDAO.clearAll();
  await ProductDAO.clearAll();
  await CategoryDAO.clearAll();
  await BrandDAO.clearAll();
}

appPool
  .connect()
  .then(async function (pool) {
    dbConfig.db.pool = pool;
    console.log("SQL Connected!");

    if (process.argv[2] === "--clean") {
      console.log("cleaning db ...");
      await dbClean();
    } else if (process.argv[2] === "--import") {
      console.log("should import");
      await importDB();
    }
    console.log("ALL DONE !!!");
  })
  .catch(function (err) {
    console.error("Error creating db connection pool", err);
  });

// console.log(process.argv);
