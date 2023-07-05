const { json } = require("body-parser");
const fs = require("fs");

const rawData = fs.readFileSync("../data/users.json");
const usersData = JSON.parse(rawData);
let cart = [];
for (let i of usersData) {
  cart.push({
    cartID: i.userID,
    userID: i.userID,
  });
}
let data = JSON.stringify(cart);
fs.writeFileSync("cart.json", data);
