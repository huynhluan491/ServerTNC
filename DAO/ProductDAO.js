// const products = require("../../client/src/data/products.json");
const sql = require("mssql");
const ProductSchema = require("../model/Product");
const BrandSchema = require("../model/Brand")
const RatingSchema = require("../model/Rating");
const dbConfig = require("../database/dbconfig");
const dbUtils = require("../utils/dbUtils");
const StaticData = require("../utils/StaticData");
const categoryController = require("../controllers/Category");

exports.addProductIfNotExisted = async (product) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  product.createdAt = new Date().toISOString();

  let insertData = ProductSchema.validateData(product);

  let query = `SET IDENTITY_INSERT ${ProductSchema.schemaName} ON insert into ${ProductSchema.schemaName}`;
  const { request, insertFieldNamesStr, insertValuesStr } =
    dbUtils.getInsertQuery(
      ProductSchema.schema,
      dbConfig.db.pool.request(),
      insertData
    );
  if (!insertFieldNamesStr || !insertValuesStr) {
    throw new Error("Invalid insert param");
  }

  query +=
    " (" +
    insertFieldNamesStr +
    ") select  " +
    insertValuesStr +
    ` WHERE NOT EXISTS(SELECT * FROM ${ProductSchema.schemaName} WHERE name = @name)` +
    ` SET IDENTITY_INSERT ${ProductSchema.schemaName} OFF`;
  // console.log(query);

  let result = await request.query(query);

  // console.log(result);
  return result.recordsets;
};

exports.clearAll = async () => {
  query = `delete ${ProductSchema.schemaName}  DBCC CHECKIDENT ('[${ProductSchema.schemaName} ]', RESEED, 1);`;
  let result = await dbConfig.db.pool.request().query(query);
  return result.recordsets;
};

exports.getProductByName = async (name) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      `${ProductSchema.schema.name.name}`,
      ProductSchema.schema.name.sqlType,
      name
    )
    .query(
      `select * from ${ProductSchema.schemaName} where ${ProductSchema.schema.name.name} = @${ProductSchema.schema.name.name}`
    );
  return result.recordsets[0][0];
};

exports.getProductById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      `${ProductSchema.schema.productID.name}`,
      ProductSchema.schema.productID.sqlType,
      id
    )
    .query(
      `select * from ${ProductSchema.schemaName} where ${ProductSchema.schema.productID.name} = @${ProductSchema.schema.productID.name}`
    );
  return result.recordsets[0][0];
};

exports.getAllProducts = async (filter) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }

  const page = filter.page * 1 || 1;
  let pageSize = filter.pageSize * 1 || StaticData.config.MAX_PAGE_SIZE;
  if (pageSize > StaticData.config.MAX_PAGE_SIZE) {
    pageSize = StaticData.config.MAX_PAGE_SIZE;
  }
  let selectQuery = `SELECT ${ProductSchema.schemaName}.*, ${BrandSchema.schemaName}.brandName FROM ${ProductSchema.schemaName}
  join ${BrandSchema.schemaName} on ${BrandSchema.schemaName}.brandID = ${ProductSchema.schemaName}.brandID `;
  let countQuery = `SELECT COUNT(DISTINCT ${ProductSchema.schema.productID.name}) as totalItem from ${ProductSchema.schemaName}`;

  const { filterStr, paginationStr } = dbUtils.getFilterProductsQuery(
    ProductSchema.schema,
    filter,
    page,
    pageSize,
    ProductSchema.defaultSort
  );

  // console.log(filterStr);

  if (filterStr) {
    selectQuery += " " + filterStr;
    countQuery += " " + filterStr;
  }

  if (paginationStr) {
    selectQuery += " " + paginationStr;
  }

  console.log("selectQuery filter product",selectQuery);

  const result = await dbConfig.db.pool.request().query(selectQuery);
  let countResult = await dbConfig.db.pool.request().query(countQuery);
  let totalProduct = 0;
  if (countResult.recordsets[0].length > 0) {
    totalProduct = countResult.recordsets[0][0].totalItem;
  }
  let totalPage = Math.ceil(totalProduct / pageSize); //round up
  const products = result.recordsets[0];
  // console.log("finish log", selectQuery);
  return {
    page,
    pageSize,
    totalPage,
    totalProduct,
    dataProducts: products,
  };
};
exports.createNewRating = async (product) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  if (!product) {
    throw new Error("Invalid input param");
  }
  let request = dbConfig.db.pool.request();
  console.log(product);
  let query = `insert into ${RatingSchema.schemaName}(${ProductSchema.schema.productID.name}) values(${product.productID})`;
  console.log(query);
  let result = await request.query(query);
  return result.recordsets;
};
exports.createNewProduct = async (product) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  if (!product) {
    throw new Error("Invalid input param");
  }
  product.createdAt = new Date().toISOString();
  let insertData = ProductSchema.validateData(product);
  let query = `insert into ${ProductSchema.schemaName}`;
  const { request, insertFieldNamesStr, insertValuesStr } =
    dbUtils.getInsertQuery(
      ProductSchema.schema,
      dbConfig.db.pool.request(),
      insertData
    );
  query += " (" + insertFieldNamesStr + ") values (" + insertValuesStr + ")";
  // console.log(query);
  let result = await request.query(query);
  return result.recordsets;
};

exports.deleteProductById = async (id) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request
    .input(
      `${ProductSchema.schema.productID.name}`,
      ProductSchema.schema.productID.sqlType,
      id
    )
    .query(
      `delete ${ProductSchema.schemaName} where ${ProductSchema.schema.productID.name} = @${ProductSchema.schema.productID.name}`
    );
  return result.recordsets;
};

exports.deleteMultipleProductById = async (idList) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  for (let i = 0; i < idList.length; i++) {
    ProductSchema.schema.productID.validate(idList[i]);
  }
  let request = dbConfig.db.pool.request();
  const deleteStr = dbUtils.getDeleteQuery(ProductSchema, idList);
  let result = await request.query(
    `DELETE FROM ${ProductSchema.schemaName} WHERE ${ProductSchema.schema.productID.name} ${deleteStr}`
  );
  return result.recordsets;
};

exports.updateProductById = async (id, updateInfo) => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  if (!updateInfo) {
    throw new Error("Invalid input param");
  }
  // console.log(updateInfo);
  let query = `update ${ProductSchema.schemaName} set`;
  const { request, updateStr } = dbUtils.getUpdateQuery(
    ProductSchema.schema,
    dbConfig.db.pool.request(),
    updateInfo
  );
  if (!updateStr) {
    throw new Error("Invalid update param");
  }
  request.input(
    `${ProductSchema.schema.productID.name}`,
    ProductSchema.schema.productID.sqlType,
    id
  );
  query +=
    " " +
    updateStr +
    ` where ${ProductSchema.schema.productID.name} = @${ProductSchema.schema.productID.name}`;
  let result = await request.query(query);
  return result.recordsets;
};

exports.getProductsNotPagination = async () => {
  if (!dbConfig.db.pool) {
    throw new Error("Not connected to db");
  }
  let request = dbConfig.db.pool.request();
  let result = await request.query(`select * from product`);
  return result.recordsets[0];
};
