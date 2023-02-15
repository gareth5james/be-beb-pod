const db = require("../db/connection.js");
const format = require("pg-format");
const products = require("../db/data/products.js");

const seed = async (data) => {
  const { opening, fees } = data;
  await db.query(`DROP TABLE IF EXISTS opening;`);
  await db.query(`DROP TABLE IF EXISTS fees;`);
  await db.query(`DROP TABLE IF EXISTS products;`);

  const openingTablePromise = db.query(`CREATE TABLE opening (
        opening_id SERIAL PRIMARY KEY,
        Day VARCHAR NOT NULL,
        Hours VARCHAR NOT NULL
    );`);

  const feesTablePromise = db.query(`CREATE TABLE fees (
        fees_id SERIAL PRIMARY KEY,
        column1 VARCHAR,
        column2 VARCHAR,
        column3 VARCHAR
    );`);

  const productsTablePromise = db.query(`CREATE TABLE products (
    products_id SERIAL PRIMARY KEY,
    product VARCHAR,
    type VARCHAR,
    price VARCHAR
  );`);

  await Promise.all([
    feesTablePromise,
    openingTablePromise,
    productsTablePromise,
  ]);

  const insertOpeningQueryString = format(
    "INSERT INTO opening (Day, Hours) VALUES %L RETURNING *;",
    opening.map(({ Day, Hours }) => [Day, Hours])
  );

  const openingPromise = db
    .query(insertOpeningQueryString)
    .then((result) => result.rows);

  const insertFeesQueryString = format(
    "INSERT INTO fees (column1, column2, column3) VALUES %L RETURNING *;",
    fees.map(({ column1, column2, column3 }) => [column1, column2, column3])
  );

  const feesPromise = db
    .query(insertFeesQueryString)
    .then((result) => result.rows);

  const insertProductsQueryString = format(
    "INSERT INTO products (product, type, price) VALUES %L RETURNING *;",
    products.map(({ product, type, price }) => [product, type, price])
  );

  const productPromise = db
    .query(insertProductsQueryString)
    .then((result) => result.rows);

  await Promise.all([openingPromise, feesPromise, productPromise]);
};

module.exports = seed;
