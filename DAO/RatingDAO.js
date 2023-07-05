const RatingSchema = require("../model/Rating");
const dbConfig = require("../database/dbconfig");
const dbUtils = require("../utils/dbUtils");

exports.getRatingById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      `${RatingSchema.schema.ratingID.name}`,
      RatingSchema.schema.ratingID.sqlType,
      id
    )
    .query(
      `select * from ${RatingSchema.schemaName} where ${RatingSchema.schema.ratingID.name} = @${RatingSchema.schema.ratingID.name}`
    );
  return result.recordsets[0][0];
};

exports.addRatingIfNotExisted = async (rating) => {
  const dbPool = dbConfig.db.pool;
  if (!dbPool) {
    throw new Error("Not connected to db");
  }
  rating.createdAt = new Date().toISOString();

  let query = `SET IDENTITY_INSERT ${RatingSchema.schemaName} ON insert into ${RatingSchema.schemaName}`;

  let insertData = RatingSchema.validateData(rating);
  const { request, insertFieldNamesStr, insertValuesStr } =
    dbUtils.getInsertQuery(RatingSchema.schema, dbPool.request(), insertData);
  if (!insertFieldNamesStr || !insertValuesStr) {
    throw new Error("Invalid insert param");
  }
  query +=
    " (" +
    insertFieldNamesStr +
    ") select  " +
    insertValuesStr +
    ` WHERE NOT EXISTS(SELECT * FROM ${RatingSchema.schemaName} WHERE productID = @productID)` +
    ` SET IDENTITY_INSERT ${RatingSchema.schemaName} OFF`;
  let result = await request.query(query);
  return result.recordsets;
};

exports.clearAll = async () => {
  query = `delete ${RatingSchema.schemaName}  DBCC CHECKIDENT ('[${RatingSchema.schemaName} ]', RESEED, 1);`;
  let result = await dbConfig.db.pool.request().query(query);
  return result.recordsets;
};
exports.getAllRatings = async () => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request.query(`select * from ${RatingSchema.schemaName}`);
  return result.recordsets[0];
};
exports.getRatingByProductId = async (id) => {
  console.log(id);
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      `${RatingSchema.schema.productID.name}`,
      RatingSchema.schema.productID.sqlType,
      id
    )
    .query(
      `select * from ${RatingSchema.schemaName} where ${RatingSchema.schema.productID.name} = @${RatingSchema.schema.productID.name}`
    );
  // console.log(result);
  return result.recordsets[0][0];
};

exports.createNewRating = async (rating) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  if (!rating) {
    throw new Error("Invalid input param");
  }
  let insertData = RatingSchema.validateData(rating);
  let query = `insert into ${RatingSchema.schemaName}`;
  const { request, insertFieldNamesStr, insertValuesStr } =
    dbUtils.getInsertQuery(
      RatingSchema.schema,
      dbConfig.db.pool.request(),
      insertData
    );
  query += " (" + insertFieldNamesStr + ") values (" + insertValuesStr + ")";
  // console.log(query);
  let result = await request.query(query);
  return result.recordsets;
};

exports.deleteRatingById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      `${RatingSchema.schema.ratingID.name}`,
      RatingSchema.schema.ratingID.sqlType,
      id
    )
    .query(
      `delete ${RatingSchema.schemaName} where ${RatingSchema.schema.ratingID.name} = @${RatingSchema.schema.ratingID.name}`
    );
  return result.recordsets;
};

exports.updateRatingById = async (productID, updateInfo) => {
  // console.log(productID);
  // console.log(updateInfo);
  const { rating } = updateInfo;
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  const starQuantity = `_${rating}star`;
  let query = `update ${RatingSchema.schemaName} set ${starQuantity} = ${starQuantity} + 1`;
  let request = dbConfig.db.pool.request();
  request.input(
    `${RatingSchema.schema.productID.name}`,
    RatingSchema.schema.productID.sqlType,
    productID
  );
  query +=
    " " +
    ` where ${RatingSchema.schema.productID.name} = @${RatingSchema.schema.productID.name}`;
  let result = await request.query(query);
  return result.recordsets;
};
