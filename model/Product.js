const sql = require("mssql");
const ModelSchemaValidator = require("./ModelSchemaValidator");
const ModelSchema = require("./ModelSchema");

const ProductSchema = new ModelSchema(
  {
    productID: new ModelSchemaValidator({
      name: "productID",
      sqlType: sql.Int,
    }),
    stock: new ModelSchemaValidator({
      name: "stock",
      sqlType: sql.Int,
    }),
    name: new ModelSchemaValidator({
      name: "name",
      sqlType: sql.NVarChar,
      require: true,
    }),
    favorite: new ModelSchemaValidator({
      name: "favorite",
      sqlType: sql.Int,
      require: true,
      validator: function (val) {
        return 0 || 1;
      },
    }),
    categoryID: new ModelSchemaValidator({
      name: "categoryID",
      sqlType: sql.Int,
      require: true,
    }),
    price: new ModelSchemaValidator({
      name: "price",
      sqlType: sql.Float,
      require: true,
    }),

    brandID: new ModelSchemaValidator({
      name: "brandID",
      sqlType: sql.Int,
      require: true,
    }),
    image: new ModelSchemaValidator({
      name: "image",
      sqlType: sql.NVarChar,
      require: true,
    }),
    sale: new ModelSchemaValidator({
      name: "sale",
      sqlType: sql.Float,
      default: "",
    }),
    description: new ModelSchemaValidator({
      name: "description",
      sqlType: sql.NVarChar,
      require: true,
      validator: function (val) {
        return val.length > 0;
      },
    }),
    createdAt: new ModelSchemaValidator({
      name: "createdAt",
      sqlType: sql.DateTime,
      default: new Date().toISOString(),
      require: true,
    }),
  },
  "Product",
  "price"
);
module.exports = ProductSchema;
