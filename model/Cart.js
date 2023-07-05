const sql = require("mssql");
const ModelSchema = require("./ModelSchema");
const ModelSchemaValidator = require("./ModelSchemaValidator");

const CartSchema = new ModelSchema(
  {
    cartID: new ModelSchemaValidator({
      name: "cartID",
      sqlType: sql.Int,
    }),
    userID: new ModelSchemaValidator({
      name: "userID",
      sqlType: sql.Int,
    }),
    createdAt: new ModelSchemaValidator({
      name: "createdAt",
      sqlType: sql.DateTime,
      default: new Date().toISOString(),
      require: true,
    }),
  },
  "Cart",
  "cartID"
);
const Cart_ProductSchema = new ModelSchema(
  {
    cartID: new ModelSchemaValidator({
      name: "cartID",
      sqlType: sql.Int,
    }),
    productID: new ModelSchemaValidator({
      name: "productID",
      sqlType: sql.Int,
    }),
    amount: new ModelSchemaValidator({
      name: "amount",
      sqlType: sql.Int,
      require: true,
    }),
    createdAt: new ModelSchemaValidator({
      name: "createdAt",
      sqlType: sql.DateTime,
      default: new Date().toISOString(),
      require: true,
    }),
  },
  "Cart_Product",
  "createAt"
);

module.exports = { CartSchema, Cart_ProductSchema };
