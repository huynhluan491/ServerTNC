const ModelSchema = require("./ModelSchema");
const ModelSchemaValidator = require("./ModelSchemaValidator");
const sql = require("mssql");

const FeatureSchema = new ModelSchema(
  {
    featureID: new ModelSchemaValidator({
      name: "featureID",
      sqlType: sql.Int,
    }),
    feature: new ModelSchemaValidator({
      name: "feature",
      sqlType: sql.NVarChar,
      require: true,
      default: "",
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
  "feature",
  "createAt"
);
module.exports = FeatureSchema;
