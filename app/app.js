const express = require("express");
const app = express();
const cors = require("cors");
const db = require("../db/connection.js");
const { psqlErrors, handle500 } = require("./errors.js");

app.use(cors());

app.use(express.json());

app.get("/api/fees", (request, response, next) => {
  db.query(`SELECT * FROM fees SORT BY fees_id;`)
    .then((result) => {
      const fees = result.rows;
      response.status(200).send({ fees });
    })
    .catch(next);
});

app.patch("/api/fees/:fees_id", (request, response, next) => {
  const { column1, column2, column3 } = request.body;
  db.query(
    `UPDATE fees SET column1 = $1, column2 = $2, column3 = $3 WHERE fees_id = $4 RETURNING *`,
    [column1, column2, column3, request.params.fees_id]
  )
    .then((result) => {
      if (result.rows.length === 0) {
        response.status(404).send({ msg: "No such fee" });
      } else {
        const fee = result.rows[0];
        response.status(202).send({ fee });
      }
    })
    .catch(next);
});

app.post("/api/fees", (request, response, next) => {
  const { column1, column2, column3 } = request.body;
  db.query(
    `INSERT INTO fees (column1, column2, column3) VALUES ($1, $2, $3) RETURNING *`,
    [column1, column2, column3]
  )
    .then((result) => {
      const fee = result.rows[0];
      response.status(201).send({ fee });
    })
    .catch(next);
});

app.get("/api/hours", (request, response, next) => {
  db.query(`SELECT * FROM opening;`)
    .then((result) => {
      const opening = result.rows;
      response.status(200).send({ opening });
    })
    .catch(next);
});

app.patch("/api/hours/:opening_id", (request, response, next) => {
  const { Day, Hours } = request.body;
  db.query(
    `UPDATE opening SET Day = $1, Hours = $2 WHERE opening_id = $3 RETURNING *;`,
    [Day, Hours, request.params.opening_id]
  )
    .then((result) => {
      if (result.rows.length === 0) {
        response.status(404).send({ msg: "No such opening" });
      } else {
        const opening = result.rows[0];
        response.status(202).send({ opening });
      }
    })
    .catch(next);
});

app.post("/api/hours", (request, response, next) => {
  const { Day, Hours } = request.body;
  db.query(`INSERT INTO opening (Day, Hours) VALUES ($1, $2) RETURNING *;`, [
    Day,
    Hours,
  ])
    .then((result) => {
      const opening = result.rows[0];
      response.status(201).send({ opening });
    })
    .catch(next);
});

app.get("/api/products", (request, response, next) => {
  db.query(`SELECT * FROM products;`).then((result) => {
    const products = result.rows;
    response.status(200).send({ products });
  });
});

app.patch("/api/products/:product_id", (request, response, next) => {
  const { product, type, price } = request.body;
  db.query(
    `UPDATE products SET product = $1, type = $2, price = $3 WHERE products_id = $4 RETURNING *;`,
    [product, type, price, request.params.product_id]
  )
    .then((result) => {
      if (result.rows.length === 0) {
        response.status(404).send({ msg: "No such opening" });
      } else {
        const product = result.rows[0];
        response.status(202).send({ product });
      }
    })
    .catch(next);
});

app.post("/api/products", (request, response, next) => {
  const { product, type, price } = request.body;

  db.query(
    `INSERT INTO products (product, type, price) VALUES ($1, $2, $3) RETURNING *;`,
    [product, type, price]
  )
    .then((result) => {
      const product = result.rows[0];
      response.status(201).send({ product });
    })
    .catch(next);
});

app.all("*", (request, response) => {
  response.status(404).send({ msg: "Path not found" });
});

app.use(psqlErrors);
app.use(handle500);

module.exports = app;
