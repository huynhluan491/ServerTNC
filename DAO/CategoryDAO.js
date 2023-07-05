const dbConfig = require("../database/dbconfig");
const CategorySchema = require("../model/Category");

const dbUtils = require("../utils/dbUtils");
exports.addCateIfNotExists = async (cate) => {
  const dbPool = dbConfig.db.pool;
  if (!dbPool) {
    throw new Error("Not connected to db");
  }
  cate.createdAt = new Date().toISOString();

  let insertData = CategorySchema.validateData(cate);
  let query = `SET IDENTITY_INSERT ${CategorySchema.schemaName} ON insert into ${CategorySchema.schemaName}`;
  const { request, insertFieldNamesStr, insertValuesStr } =
    dbUtils.getInsertQuery(CategorySchema.schema, dbPool.request(), insertData);
  if (!insertFieldNamesStr || !insertValuesStr) {
    throw new Error("Invalid insert param");
  }

  query +=
    " (" +
    insertFieldNamesStr +
    ") select  " +
    insertValuesStr +
    ` WHERE NOT EXISTS(SELECT * FROM ${CategorySchema.schemaName} WHERE categoryName = @categoryName)` +
    ` SET IDENTITY_INSERT ${CategorySchema.schemaName} OFF`;
  let result = await request.query(query);
  return result.recordsets;
};

exports.clearAll = async () => {
  query = `delete ${CategorySchema.schemaName}  DBCC CHECKIDENT ('[${CategorySchema.schemaName} ]', RESEED, 1);`;
  let result = await dbConfig.db.pool.request().query(query);
  return result.recordsets;
};
exports.getCategories = async () => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request.query(`select * from category`);
  return result.recordsets[0];
};

exports.getCategoryIdByName = async (name) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      `${CategorySchema.schema.categoryName.name}`,
      CategorySchema.schema.categoryName.sqlType,
      name
    )
    .query(
      `select categoryID from ${CategorySchema.schemaName} where ${CategorySchema.schema.categoryName.name} = @${CategorySchema.schema.categoryName.name}`
    );
  return result.recordsets[0][0].categoryID;
};

exports.getCategoryById = async (id) => {
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      `${CategorySchema.schema.categoryID.name}`,
      CategorySchema.schema.categoryID.sqlType,
      id
    )
    .query(
      `select * from ${CategorySchema.schemaName} where ${CategorySchema.schema.categoryID.name} = @${CategorySchema.schema.categoryID.name}`
    );
  return result.recordsets[0][0];
};
