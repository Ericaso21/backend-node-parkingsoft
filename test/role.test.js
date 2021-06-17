const request = require("supertest");

const app = require("../build/index");

describe("GET /api/roles/list", () => {
  it("Response get roles api", (done) => {
    request(app)
      .get("/api/roles/list")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});

describe("GET /api/roles/getOne/:id", () => {
  it("Response get one role api", (done) => {
    request(app)
      .get("/api/roles/getOne/1")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  it("Response get one role not found", (done) => {
    request(app)
      .get("/api/roles/getOne/10")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404)
      .expect('{"status":false,"message":"Rol no encontrado."}')
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("POST /api/roles/create", () => {
  it("responde with 200 created", (done) => {
    const data = {
      name_role: "RolPrueba2",
      description_role: "Prueba test role",
      role_status: "2",
      created_att: new Date(),
    };
    request(app)
      .post("/api/roles/create")
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
      name_role: "RolPrueba",
      description_role: "Prueba test role",
      role_status: "2",
      created_att: new Date(),
    };
    request(app)
      .post("/api/roles/create")
      .send(data)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404)
      .expect('{"status":false,"message":"El nombre del rol ya existe."}')
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("PUT /api/roles/update/:id", () => {
  it("response with 200 updated", (done) => {
    const data = {
      name_role: "RolPrueba",
      description_role: "Prueba test role",
      role_status: "1",
      updated_att: new Date(),
    };
    request(app)
      .put("/api/roles/update/4")
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
      name_role: "Administrador",
      description_role: "Prueba test role",
      role_status: "1",
      updated_att: new Date(),
    };
    request(app)
      .put("/api/roles/update/4")
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

describe("DELETE /api/roles/delete/:id", () => {
  it("response with 200 deleted", (done) => {
    request(app)
      .delete("/api/roles/delete/4")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  it("response with 404 role not found deleted", (done) => {
    request(app)
      .delete("/api/roles/delete/1")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404)
      .expect(
        '{"status":false,"message":"El rol esta asociado a uno o varios empleados no se puede eliminar."}'
      )
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});
