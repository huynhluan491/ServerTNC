const ModelSchema = require("./ModelSchema");
const ModelSchemaValidator = require("./ModelSchemaValidator");
const sql = require("mssql");

const BillSchema = new ModelSchema({}, "Bill", "createAt");
