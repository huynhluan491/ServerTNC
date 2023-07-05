const sql = require("mssql");
const ModelSchema = require("./ModelSchema");
const ModelSchemaValidator = require("./ModelSchemaValidator");
const StaticData = require("../utils/StaticData");

const UserSchema = new ModelSchema(
  {
    userID: new ModelSchemaValidator({
      name: "userID",
      sqlType: sql.Int,
    }),
    userName: new ModelSchemaValidator({
      name: "userName",
      sqlType: sql.VarChar,
      require: true,
    }),
    password: new ModelSchemaValidator({
      name: "password",
      sqlType: sql.VarChar,
      require: true,
    }),
    auth: new ModelSchemaValidator({
      name: "auth",
      sqlType: sql.Int,
      require: true,
      default: StaticData.AUTH.Role.user,
    }),
    email: new ModelSchemaValidator({
      name: "email",
      require: true,
      sqlType: sql.VarChar,
      validator: function (val) {
        return String(val)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      },
    }),
    createdAt: new ModelSchemaValidator({
      name: "createdAt",
      sqlType: sql.DateTime,
      default: new Date().toISOString(),
      require: true,
    }),
  },
  "Users",
  "auth"
);

module.exports = UserSchema;
