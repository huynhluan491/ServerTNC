const dbConfig = require("../database/dbconfig");
const BrandSchema = require("../model/Brand");
const BrandShcema = require("../model/Brand");
const dbUtils = require("../utils/dbUtils");

exports.addBrandIfNotExists = async (brand) => {
  const dbPool = dbConfig.db.pool;
  if (!dbPool) {
    throw new Error("Not connected to db");
  }
  brand.createdAt = new Date().toISOString();

  let insertData = BrandShcema.validateData(brand);
  let query = `SET IDENTITY_INSERT ${BrandShcema.schemaName} ON insert into ${BrandShcema.schemaName}`;
  const { request, insertFieldNamesStr, insertValuesStr } =
    dbUtils.getInsertQuery(BrandShcema.schema, dbPool.request(), insertData);
  if (!insertFieldNamesStr || !insertValuesStr) {
    throw new Error("Invalid insert param");
  }

  query +=
    " (" +
    insertFieldNamesStr +
    ") select  " +
    insertValuesStr +
    ` WHERE NOT EXISTS(SELECT * FROM ${BrandShcema.schemaName} WHERE brandName = @brandName)` +
    ` SET IDENTITY_INSERT ${BrandShcema.schemaName} OFF`;
  let result = await request.query(query);
  return result.recordsets;
};

exports.clearAll = async () => {
  query = `delete ${BrandShcema.schemaName}  DBCC CHECKIDENT ('[${BrandShcema.schemaName} ]', RESEED, 1);`;
  let result = await dbConfig.db.pool.request().query(query);
  return result.recordsets;
};

exports.getBrands = async () => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request.query(`select * from brand`);
  return result.recordsets[0];
};

exports.getBrandById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      `${BrandSchema.schema.brandID.name}`,
      BrandSchema.schema.brandID.sqlType,
      id
    )
    .query(
      `select * from ${BrandSchema.schemaName} where ${BrandSchema.schema.brandID.name} = @${BrandSchema.schema.brandID.name}`
    );
  return result.recordsets[0][0];
};
