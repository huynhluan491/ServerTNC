const SubImageDAO = require("../DAO/SubImageDAO");
const ProductDAO = require("../DAO/ProductDAO");
const path = require("path");
const fs = require("fs");
exports.getSubImages = async (req, res) => {
  try {
    let subimgs;
    let id;
    if (req.query.productId) {
      id = req.query.productId * 1;
      subimgs = await SubImageDAO.getProductSubImgById(id);
    } else {
      subimgs = await SubImageDAO.getAllSubImages();
    }
    if (!subimgs) {
      return res
        .status(404) //NOT FOUND
        .json({
          code: 404,
          msg: id
            ? `Not found subimgs with productId ${id}!`
            : `Not found subimgs!`,
        });
    }
    return res.status(200).json({
      code: 200,
      msg: null,
      data: subimgs,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      code: 500,
      msg: e,
    });
  }
};

exports.getSubImgById = async (req, res) => {
  // console.log(req.params);
  const id = req.params.id * 1;
  try {
    const subImg = await SubImageDAO.getSubImgById(id);
    if (!subImg) {
      return res
        .status(404) //NOT FOUND
        .json({
          code: 404,
          msg: `Not found subImg with Id ${id}!`,
        });
    }
    return res.status(200).json({
      code: 200,
      msg: null,
      data: subImg,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      code: 500,
      msg: e,
    });
  }
};

exports.createNewSubImg = async (req, res) => {
  const newSubImg = req.body;
  try {
    await SubImageDAO.createNewSubImg(newSubImg);
    // console.log(`Created new product successfully!`);
    return res.status(200).json({
      code: 200,
      msg: null,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      msg: `SubImg create failed`,
    });
  }
};

exports.deleteSubImgById = async (req, res) => {
  const id = req.params.id * 1;
  // console.log("id", id);
  try {
    const subImg = await SubImageDAO.getSubImgById(id);
    if (!subImg) {
      res
        .status(404) //NOT FOUND
        .json({
          code: 404,
          msg: `subImg with Id ${id} not found!`,
        });
    }
    await SubImageDAO.deleteSubImgById(id);
    res.status(200).json({
      code: 200,
      msg: null,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      msg: e,
    });
  }
};

exports.updateSubImgById = async (req, res) => {
  const id = req.params.id * 1;
  try {
    const updateInfo = req.body;
    let subImg = await SubImageDAO.getSubImgById(id);
    if (!subImg) {
      return res.status(404).json({
        code: 404,
        msg: `Not found subImg with Id ${id}!`,
      });
    }
    await SubImageDAO.updateSubImgById(id, updateInfo);
    subImg = await SubImageDAO.getSubImgById(id);
    return res.status(200).json({
      code: 200,
      msg: null,
      data: subImg,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      msg: `Update subImg with id: ${id} failed!`,
    });
  }
};

exports.getFileSubImage = async (req, res) => {
  let id = req.params.id;
  const result = await SubImageDAO.getSubImgById(id);
  const imageName = result.image;
  const dirPath = path.join(__dirname, "..", "dev-data", "subImgimages");
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(404).json({
        code: 404,
        msg: `FAIL`,
      });
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
exports.saveFileSubImage = async (req, res) => {
  let infor = req.body;
  const imagePath = path.join(
    __dirname,
    "..",
    "dev-data",
    "subImgimages",
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
  let img = {
    image: infor.imageName,
    alt: infor.alt,
    productID: infor.productID,
  };
  await SubImageDAO.addImage(img);
};
exports.deleteFileSubImage = async (req, res, next) => {
  let id = req.params.id;
  await SubImageDAO.getSubImgById(id).then((result) => {
    // console.log(result);
    const dirPath = path.join(__dirname, "..", "dev-data", "subImgimages");
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }
      const matchingFile = files.find((file) => file.startsWith(result.image));
      if (matchingFile) {
        const imagePath = path.join(dirPath, matchingFile);
        // console.log(`Found file: ${imagePath}`);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ error: "Failed to delete the file." });
          } else {
            // console.log("File deleted successfully.");
            next();
          }
        });
      }
    });
  });
};
