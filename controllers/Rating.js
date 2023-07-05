const RatingDAO = require("../DAO/RatingDAO");

exports.getRatingById = async (req, res) => {
  // console.log(req.params);
  const id = req.params.id * 1;
  try {
    const rating = await RatingDAO.getRatingById(id);
    console.log(rating);
    if (!rating) {
      return res
        .status(404) //NOT FOUND
        .json({
          code: 404,
          msg: `Not found rating with Id ${id}!`,
        });
    }

    return res.status(200).json({
      code: 200,
      msg: null,
      data:rating,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      code: 500,
      msg: e,
    });
  }
};

exports.getRatings = async (req, res) => {
  try {
    let rating;
    let id;
    if (req.query.productId) {
      id = req.query.productId * 1;
      rating = await RatingDAO.getRatingByProductId(id);
    } else {
      rating = await RatingDAO.getAllRatings();
    }
    if (!rating) {
      return res
        .status(404) //NOT FOUND
        .json({
          code: 404,
          msg: id
            ? `Not found ratings with productId ${id}!`
            : `Not found ratings!`,
        });
    }
    return res.status(200).json({
      code: 200,
      msg: null,
      data:rating,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      code: 500,
      msg: e,
    });
  }
};

exports.createNewRating = async (req, res) => {
  const newRating = req.body;
  try {
    await RatingDAO.createNewRating(newRating);
    return res.status(200).json({
      code: 200,
      msg: null,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      msg: `Create new rating failed!`,
    });
  }
};

exports.deleteRatingById = async (req, res) => {
  const id = req.params.id * 1;
  try {
    const rating = await RatingDAO.getRatingById(id);
    if (!rating) {
      return res
        .status(404) //NOT FOUND
        .json({
          code: 404,
          msg: `Rating with Id ${id} not found!`,
        });
    }
    await RatingDAO.deleteRatingById(id);
    return res.status(200).json({
      code: 200,
      msg: null,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      code: 500,
      msg: `Delete rating with id ${id} failed!`,
    });
  }
};

exports.updateRatingById = async (req, res) => {
  // console.log("Id update", req.params.id);
  try {
    const updateInfo = req.body;
    const productID = updateInfo.productID;
    delete updateInfo.productID;
    // console.log(updateInfo);
    await RatingDAO.updateRatingById(productID, updateInfo);
    rating = await RatingDAO.getRatingByProductId(productID);
    return res.status(200).json({
      code: 200,
      msg: null,
      data:rating,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      msg: `Update rating with id failed!`,
    });
  }
};
