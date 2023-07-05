const brandDAO = require("../DAO/BrandDAO");

exports.getAllBrands = async (req, res) => {
  try {
    let brands = await brandDAO.getBrands();
    res.status(200).json({
      code: 200,
      msg: null,
      data: brands
    });
  } catch (error) {
    res.status(404).json({
      code: 404,
      msg: error,
    });
  }
};

exports.getBrandById = async (req, res) => {
  // console.log("req.params", req.params);
  const id = req.params.id * 1;
  try {
    const brand = await brandDAO.getBrandById(id);
    if (!brand) {
      return res
        .status(404) //NOT FOUND
        .json({
          code: 404,
          msg: `Not found brand with Id ${id}!`,
        });
    }
    return res.status(200).json({
      code: 200,
      msg: null,
      data: brand
    });
  } catch (e) {
    return res.status(500).json({
      code: 500,
      msg: e,
    });
  }
};
