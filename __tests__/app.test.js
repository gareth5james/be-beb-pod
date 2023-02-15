const app = require("../app/app.js");
const db = require("../db/connection.js");
const request = require("supertest");
const testData = require("../db/data/index.js");
const seed = require("../seeds/seed.js");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("handles bad paths", () => {
  it("returns 404 - bad path", () => {
    return request(app)
      .get("/api/cheese")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Path not found");
      });
  });
});

describe("serves fees", () => {
  it("returns 200 and an array of fee objects", () => {
    return request(app)
      .get("/api/fees")
      .expect(200)
      .then(({ body: { fees } }) => {
        expect(fees).toBeInstanceOf(Array);
        expect(fees.length).toBe(12);
        fees.forEach((fee) => {
          expect(fee).toEqual(
            expect.objectContaining({
              fees_id: expect.any(Number),
              column1: expect.any(String),
              column2: expect.any(String),
              column3: expect.any(String),
            })
          );
        });
      });
  });
});

describe("serves opening hours", () => {
  it("returns 200 and an array of opening objects", () => {
    return request(app)
      .get("/api/hours")
      .expect(200)
      .then(({ body: { opening } }) => {
        expect(opening).toBeInstanceOf(Array);
        expect(opening.length).toBe(5);
        opening.forEach((open) => {
          expect(open).toEqual(
            expect.objectContaining({
              opening_id: expect.any(Number),
              day: expect.any(String),
              hours: expect.any(String),
            })
          );
        });
      });
  });
});

describe("serves products", () => {
  it("returns 200 and a list of products", () => {
    return request(app)
      .get("/api/products")
      .expect(200)
      .then(({ body: { products } }) => {
        expect(products).toBeInstanceOf(Array);
        expect(products.length).toBe(17);
        products.forEach((product) => {
          expect(product).toEqual(
            expect.objectContaining({
              products_id: expect.any(Number),
              product: expect.any(String),
              type: expect.any(String),
              price: expect.any(String),
            })
          );
        });
      });
  });
});

describe("patches fees", () => {
  it("returns 202 and an updated fee", () => {
    const newFee = { column1: "New Patient", column2: "£65", column3: "£68" };

    return request(app)
      .patch("/api/fees/1")
      .send(newFee)
      .expect(202)
      .then(({ body: { fee } }) => {
        expect(fee).toEqual({
          fees_id: 1,
          column1: "New Patient",
          column2: "£65",
          column3: "£68",
        });
      });
  });

  it("returns 404 when passed a bad fee_id (number not in table)", () => {
    const newFee = { column1: "New Patient", column2: "£65", column3: "£68" };

    return request(app)
      .patch("/api/fees/50")
      .send(newFee)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No such fee");
      });
  });

  it("returns 400 when passed a bad fee_id (not a number)", () => {
    const newFee = { column1: "New Patient", column2: "£65", column3: "£68" };

    return request(app)
      .patch("/api/fees/potato")
      .send(newFee)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("posts fees", () => {
  it("returns 201 and the new fee", () => {
    const newFee = {
      column1: "Chicken Sandwich",
      column2: "£65",
      column3: "£68",
    };

    return request(app)
      .post("/api/fees")
      .send(newFee)
      .expect(201)
      .then(({ body: { fee } }) => {
        expect(fee).toEqual({
          fees_id: 13,
          column1: "Chicken Sandwich",
          column2: "£65",
          column3: "£68",
        });
      });
  });
});

describe("patches hours", () => {
  it("returns 202 and a new opening object", () => {
    const newOpening = { Day: "Tuesday", Hours: "0900 - 1230 | 1330 - 1700" };

    return request(app)
      .patch("/api/hours/2")
      .send(newOpening)
      .expect(202)
      .then(({ body: { opening } }) => {
        expect(opening).toEqual({
          opening_id: 2,
          day: "Tuesday",
          hours: "0900 - 1230 | 1330 - 1700",
        });
      });
  });

  it("returns 404 for a opening_id not in the database (number)", () => {
    const newOpening = { Day: "Tuesday", Hours: "0900 - 1230 | 1330 - 1700" };

    return request(app)
      .patch("/api/hours/300")
      .send(newOpening)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No such opening");
      });
  });

  it("returns 400 for an opening_id that isn't a number", () => {
    const newOpening = { Day: "Tuesday", Hours: "0900 - 1230 | 1330 - 1700" };

    return request(app)
      .patch("/api/hours/horseradish")
      .send(newOpening)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("posts hours", () => {
  it("returns 201 and the new fee", () => {
    const newOpening = { Day: "Tuesday", Hours: "0900 - 1230 | 1330 - 1700" };

    return request(app)
      .post("/api/hours")
      .send(newOpening)
      .expect(201)
      .then(({ body: { opening } }) => {
        expect(opening).toEqual({
          opening_id: 6,
          day: "Tuesday",
          hours: "0900 - 1230 | 1330 - 1700",
        });
      });
  });
});

describe("patches products", () => {
  it("returns 202 and the updated product", () => {
    const newProduct = { product: "Laser", type: "", price: "£1000.00" };

    return request(app)
      .patch("/api/products/2")
      .send(newProduct)
      .expect(202)
      .then(({ body: { product } }) => {
        expect(product).toEqual({
          products_id: 2,
          product: "Laser",
          type: "",
          price: "£1000.00",
        });
      });
  });
});

describe("posts products", () => {
  it("returns 201 and the new product", () => {
    const newProduct = { product: "Laser", type: "", price: "£1000.00" };

    return request(app)
      .post("/api/products")
      .send(newProduct)
      .expect(201)
      .then(({ body: { product } }) => {
        expect(product).toEqual({
          products_id: 18,
          product: "Laser",
          type: "",
          price: "£1000.00",
        });
      });
  });
});
