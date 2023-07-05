const CartDAO = require("../DAO/CartDAO");

exports.getProductInCartByUSerID = async (req, res) => {
  try {
    let result = await CartDAO.getProductInCartByUSerID(req.query.userID);
    res.status(200).json({
      code: 200,
      msg: null,
      data: result
    });
  } catch (error) {
    res.status(404).json({
      code: 404,
      msg: error,
    });
  }
};

// exports.createNewCart = async(req,res)=>{
//   try {
//     let result = await CartDAO.createNewCart(req.params.userID);
//     res.status(200).json({
//       code: 200,
//       msg: "OK",
//       data: {
//         result,
//       },
//     });
//   } catch (error) {
//     res.status(404).json({
//       code: 404,
//       msg: "FAIL",
//     });
//   }
// }

exports.insertProductToCart = async (req, res) => {
  // console.log(req.body);
  try {
    let result = await CartDAO.addCart_ProductIfNotExisted(req.body);
    res.status(200).json({
      code: 200,
      msg: null,
      data: result
    });
  } catch (error) {
    res.status(404).json({
      code: 404,
      msg: error,
    });
  }
};

exports.updateProductInCart = async (req, res) => {
  // console.log(req.body);
  try {
    let result = await CartDAO.updateCart(req.body);
    res.status(200).json({
      code: 200,
      msg: null,
      data: result
    });
  } catch (error) {
    res.status(404).json({
      code: 404,
      msg: error,
    });
  }
};

exports.deleteProductInCart = async (req, res) => {
  const q = req.query;
  try {
    let result = await CartDAO.deleteItemInCart(q);
    res.status(200).json({
      code: 200,
      msg: null,
    });
  } catch (error) {
    res.status(404).json({
      code: 404,
      msg: error,
    });
  }
};
