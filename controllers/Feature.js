const FeatureDAO = require("../DAO/FeatureDAO");

exports.getFeatureById = async (req, res) => {
  const id = req.params.id * 1;
  try {
    const features = await FeatureDAO.getFeatureById(id);
    if (!features) {
      return res
        .status(404) //NOT FOUND
        .json({
          code: 404,
          msg: `Not found features with Id ${id}!`,
        });
    }
    return res.status(200).json({
      code: 200,
      msg: `Got features with id ${id} successfully!`,
      data: features,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      code: 500,
      msg: e,
    });
  }
};
exports.getFeatures = async (req, res) => {
  try {
    let features;
    let id;
    if (req.query.productId) {
      id = req.query.productId * 1;
      features = await FeatureDAO.getFeaturesByProductId(id);
    } else {
      features = await FeatureDAO.getAllFeatures();
    }
    if (!features) {
      return res
        .status(404) //NOT FOUND
        .json({
          code: 404,
          msg: id
            ? `Not found features with productId ${id}!`
            : `Not found features!`,
        });
    }
    return res.status(200).json({
      code: 200,
      msg: id
        ? `Got features with productId ${id} successfully!`
        : `Got features successfully!`,
      data: features,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      code: 500,
      msg: e,
    });
  }
};
exports.createNewFeature = async (req, res) => {
  const newFeature = req.body;
  try {
    await FeatureDAO.createNewFeature(newFeature);
    // console.log(`Created new product successfully!`);
    return res.status(200).json({
      code: 200,
      msg: null,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      msg: `Feature create failed`,
    });
  }
};
exports.deleteFeatureById = async (req, res) => {
  const id = req.params.id * 1;
  try {
    const feature = await FeatureDAO.getFeatureById(id);
    if (!feature) {
      return res
        .status(404) //NOT FOUND
        .json({
          code: 404,
          msg: `Feature with Id ${id} not found!`,
        });
    }
    await FeatureDAO.deleteFeatureById(id);
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
exports.updateFeatureById = async (req, res) => {
  const id = req.params.id * 1;
  try {
    const updateInfo = req.body;
    let feature = await FeatureDAO.getFeatureById(id);
    if (!feature) {
      return res.status(404).json({
        code: 404,
        msg: `Not found feature with Id ${id}!`,
      });
    }
    await FeatureDAO.updateFeatureById(id, updateInfo);
    feature = await FeatureDAO.getFeatureById(id);
    return res.status(200).json({
      code: 200,
      msg: `Updated feature with id: ${id} successfully!`,
      data: feature,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      code: 500,
      msg: `Update feature with id: ${id} failed!`,
    });
  }
};
