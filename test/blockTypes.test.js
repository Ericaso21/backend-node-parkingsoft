const request = require("supertest");

const app = require("../build/index");

describe("GET /api/blockTypes/list", () => {
  it("Response get roles api", (done) => {
    request(app)
      .get("/api/blockTypes/list")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});

describe("GET /api/blockTypes/getOne/:id", () => {
  it("Response get one role api", (done) => {
    request(app)
      .get("/api/blockTypes/getOne/1")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  it("Response get one role not found", (done) => {
    request(app)
      .get("/api/blockTypes/getOne/10")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404)
      .expect('{"status":false,"message":"El tipo de bloque no existe."}')
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("POST /api/blockTypes/create", () => {
  it("responde with 200 created", (done) => {
    const data = {
      name_block_type: "RolPrueba2",
      block_status: "2",
      created_att: new Date(),
    };
    request(app)
      .post("/api/blockTypes/create")
      .send(data)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it("response with 404 not found role it already exists", (done) => {
    const data = {
      name_block_type: "RolPrueba2",
      block_status: "2",
      created_att: new Date(),
    };
    request(app)
      .post("/api/blockTypes/create")
      .send(data)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404)
      .expect('{"status":false,"message":"El tipo de bloque ya existe."}')
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("PUT /api/blockTypes/update/:id", () => {
  it("response with 200 updated", (done) => {
    const data = {
      name_block_type: "RolPrueba2",
      block_status: "1",
      created_att: new Date(),
    };
    request(app)
      .put("/api/blockTypes/update/4")
      .send(data)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });

  it("response with 404 role name it already exists", (done) => {
    const data = {
      name_block_type: "RolPrueba2",
      block_status: "1",
      created_att: new Date(),
    };
    request(app)
      .put("/api/blockTypes/update/5")
      .send(data)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404)
      .expect(
        '{"status":false,"message":"El nombre del rol ya existe en otro id."}'
      )
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("DELETE /api/blockTypes/delete/:id", () => {
  it("response with 200 deleted", (done) => {
    request(app)
      .delete("/api/blockTypes/delete/5")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  it("response with 404 role not found deleted", (done) => {
    request(app)
      .delete("/api/blockTypes/delete/1")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404)
      .expect(
        '{"status":false,"message":"El tipo de bloque existe en el bloque."}'
      )
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});
