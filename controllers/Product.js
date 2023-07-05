const ProductDAO = require("../DAO/ProductDAO");
const CategoryDAO = require("../DAO/CategoryDAO");
// const ProductSchema = require("../model/Product");
const path = require("path");
const fs = require("fs");

exports.getProducts = async (req, res) => {
  console.log("req.query", req.query);
  if (req.query.categoryName) {
    const cateid = await CategoryDAO.getCategoryIdByName(
      req.query["categoryName"]
    );
    req.query.categoryID = cateid;

    delete req.query.categoryName;

    // console.log("cc", req.query);
  }
  try {
    const products = await ProductDAO.getAllProducts(req.query);
    res.status(200).json({
      code: 200,
      msg: null,
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      msg: `FAIL with ${err}`,
    });
  }
};

exports.getProductById = async (req, res) => {
  // console.log("req.params", req.params);
  const id = req.params.id * 1;
  try {
    const product = await ProductDAO.getProductById(id);
    if (!product) {
      return res
        .status(404) //NOT FOUND
        .json({
          code: 404,
          msg: `Not found product with Id ${id}!`,
        });
    }
    return res.status(200).json({
      code: 200,
      msg: null,
      data: product,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      code: 500,
      msg: e,
    });
  }
};

exports.createNewProduct = async (req, res) => {
  const newProduct = req.body;
  try {
    let product = await ProductDAO.getProductByName(newProduct.name);
    if (product) {
      return res
        .status(403) //Forbidden
        .json({
          code: 403,
          msg: `Product name duplicate!`,
        });
    }
    await ProductDAO.createNewProduct(newProduct);
    product = await ProductDAO.getProductByName(newProduct.name);
    product && (await ProductDAO.createNewRating(product));
    // console.log(`Created new product successfully!`);
    return res.status(200).json({
      code: 200,
      msg: null,
      data: product,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      msg: `Product create failed`,
    });
  }
};

exports.deleteById = async (req, res) => {
  const id = req.params.id * 1;
  try {
    const product = await ProductDAO.getProductById(id);
    if (!product) {
      return res
        .status(404) //NOT FOUND
        .json({
          code: 404,
          msg: `Product with Id ${id} not found!`,
        });
    }
    await ProductDAO.deleteProductById(id);
    return res.status(200).json({
      code: 200,
      msg: null,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      code: 500,
      msg: e,
    });
  }
};

exports.deleteMultipleProductById = async (req, res) => {
  const idList = req.query.id;
  try {
    if (!idList || idList.length === 0) {
      return res.status(403).json({
        code: 403,
        msg: `Invalid ids`,
      });
    }
    await ProductDAO.deleteMultipleProductById(idList);
    return res.status(200).json({
      code: 200,
      msg: null,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      code: 500,
      msg: `Delete products with id ${idList} failed!`,
    });
  }
};

exports.getProductNonPaginate = async (req, res) => {
  try {
    const products = await ProductDAO.getProductsNotPagination(req.query);
    if (!products) {
      return res
        .status(404) //NOT FOUND
        .json({
          code: 404,
          msg: `Products list not found!`,
        });
    }
    return res.status(200).json({
      code: 200,
      msg: null,
      data: products,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      code: 500,
      msg: e,
    });
  }
};

exports.updateProductById = async (req, res) => {
  // console.log("Id update", req.params.id);
  const id = req.params.id * 1;
  try {
    const updateInfo = req.body;
    let product = await ProductDAO.getProductById(id);
    if (!product) {
      return res.status(404).json({
        code: 404,
        msg: `Not found product with Id ${id}!`,
      });
    }
    await ProductDAO.updateProductById(id, updateInfo);
    product = await ProductDAO.getProductById(id);
    return res.status(200).json({
      code: 200,
      msg: null,
      data: product,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      msg: `Update product with id: ${id} failed!`,
    });
  }
};

exports.getFileProductImage = (req, res) => {
  let imageName = req.params.imageName;
  const dirPath = path.join(
    __dirname,
    "..",
    "dev-data",
    "productImages"
    // imageName + ".jpg"
  );
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    const matchingFile = files.find((file) => file.startsWith(imageName));
    if (matchingFile) {
      const imagePath = path.join(dirPath, matchingFile);
      // console.log(`Found file: ${imagePath}`);
      const imageStream = fs.createReadStream(imagePath);
      imageStream.pipe(res);
    }
  });
};

exports.saveFileProductImage = async (req, res) => {
  let infor = req.body;
  const imagePath = path.join(
    __dirname,
    "..",
    "dev-data",
    "productImages",
    infor.imageName
  );
  const buffer = Buffer.from(infor.blob, "base64");
  fs.writeFile(imagePath, buffer, (err) => {
    if (err) {
      // console.error(err);
      res.status(500).json({ error: "Failed to save the file." });
    } else {
      // console.log("File saved successfully.");
      res.status(200).json({ message: "File saved successfully." });
    }
  });
  const Name = infor.imageName;
  img = {
    image: Name,
  };
  await ProductDAO.updateProductById(infor.productID, img);
};
