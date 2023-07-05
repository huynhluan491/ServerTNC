const ModelSchema = require("./ModelSchema");
const ModelSchemaValidator = require("./ModelSchemaValidator");
const sql = require("mssql");
const CategorySchema = new ModelSchema(
  {
    categoryID: new ModelSchemaValidator({
      name: "categoryID",
      sqlType: sql.Int,
    }),
    categoryName: new ModelSchemaValidator({
      name: "categoryName",
      sqlType: sql.NVarChar,
      require: true,
    }),
    createdAt: new ModelSchemaValidator({
      name: "createdAt",
      sqlType: sql.DateTime,
      default: new Date().toISOString(),
      require: true,
    }),
  },
  "Category",
  "createAt"
);

module.exports = CategorySchema;
