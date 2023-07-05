const ModelSchema = require("./ModelSchema");
const ModelSchemaValidator = require("./ModelSchemaValidator");
const sql = require("mssql");
const BrandSchema = new ModelSchema(
  {
    brandID: new ModelSchemaValidator({
      name: "brandID",
      sqlType: sql.Int,
    }),
    brandName: new ModelSchemaValidator({
      name: "brandName",
      sqlType: sql.NVarChar,
      require: true,
    }),
    createdAt: new ModelSchemaValidator({
      name: "createdAt",
      sqlType: sql.DateTime,
      require: true,
      default: new Date().toISOString(),
    }),
  },
  "Brand",
  "createAt"
);

module.exports = BrandSchema;
