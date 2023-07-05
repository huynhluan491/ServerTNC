const express = require("express");
const cartController = require("../controllers/Cart");
const router = express.Router();

router
  .route("/")
  .get(cartController.getProductInCartByUSerID)
  .patch(cartController.updateProductInCart)
  .post(cartController.insertProductToCart)
  .delete(cartController.deleteProductInCart);
// router.route("/:userID").get(cartController.getProductInCartByUSerID);
module.exports = router;
