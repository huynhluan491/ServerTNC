const ModelSchema = require("./ModelSchema");
const ModelSchemaValidator = require("./ModelSchemaValidator");
const sql = require("mssql");

const RatingSchema = new ModelSchema(
  {
    ratingID: new ModelSchemaValidator({
      name: "ratingID",
      sqlType: sql.Int,
      default: 0,
    }),
    _5star: new ModelSchemaValidator({
      name: "_5star",
      sqlType: sql.Int,
      require: true,
      default: 0,
    }),
    _4star: new ModelSchemaValidator({
      name: "_4star",
      sqlType: sql.Int,
      require: true,
      default: 0,
    }),
    _3star: new ModelSchemaValidator({
      name: "_3star",
      sqlType: sql.Int,
      require: true,
      default: 0,
    }),
    _2star: new ModelSchemaValidator({
      name: "_2star",
      sqlType: sql.Int,
      require: true,
      default: 0,
    }),
    _1star: new ModelSchemaValidator({
      name: "_1star",
      sqlType: sql.Int,
      require: true,
      default: 0,
    }),
    productID: new ModelSchemaValidator({
      name: "productID",
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
  "Rating",
  "createAt"
);
module.exports = RatingSchema;
