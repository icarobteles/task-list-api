import chai from "chai";
import chaiHttp from "chai-http";
import connectToDatabase from "../../src/database/connect.js";
import app from "../../src/routes/index.js";
import dotenv from "dotenv";
import UserModel from "../../src/models/Auth.js";

chai.should();
chai.use(chaiHttp);

const user = {
  name: "Mocha User Test",
  email: "mochaTestUser@gmail.com",
  password: "mochaTest1!",
  passwordConfirmation: "mochaTest1!",
};

//ANTES DOS TESTES --> CONFIGURA O DOTENV E CONECTA AO BANCO DE DADOS
before(() => {
  dotenv.config();
  connectToDatabase();
});

describe("Auth Router", () => {
  describe("Register", () => {
    it("should register a user", (done) => {
      chai
        .request(app)
        .post("/auth/register")
        .send(user)
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.a("object");
          response.body.should.have.property("user");
          response.body.should.have.property("token");
          done();
        });
    });

    it("should give a required name field error", (done) => {
      chai
        .request(app)
        .post("/auth/register")
        .send({
          email: user.email,
          password: user.password,
          passwordConfirmation: user.passwordConfirmation,
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have
            .property("error")
            .with.equal("Name is required");
          done();
        });
    });

    it("should give a required email field error", (done) => {
      chai
        .request(app)
        .post("/auth/register")
        .send({
          name: user.name,
          password: user.password,
          passwordConfirmation: user.passwordConfirmation,
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have
            .property("error")
            .with.equal("Email is required");
          done();
        });
    });

    it("should give a required password field error", (done) => {
      chai
        .request(app)
        .post("/auth/register")
        .send({
          name: user.name,
          email: user.email,
          passwordConfirmation: user.passwordConfirmation,
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have
            .property("error")
            .with.equal("Password is required");
          done();
        });
    });

    it("should give a password error without at least one capital letter", (done) => {
      chai
        .request(app)
        .post("/auth/register")
        .send({
          ...user,
          password: "testando1!",
          passwordConfirmation: "testando1!",
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have
            .property("error")
            .with.equal("Password must be at least one capital letter");
          done();
        });
    });

    it("should give a password error without at least one lowercase letter", (done) => {
      chai
        .request(app)
        .post("/auth/register")
        .send({
          ...user,
          password: "TESTANDO1!",
          passwordConfirmation: "TESTANDO1!",
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have
            .property("error")
            .with.equal("Password must be at least one lowercase letter");
          done();
        });
    });

    it("should give a password error without at least one number", (done) => {
      chai
        .request(app)
        .post("/auth/register")
        .send({
          ...user,
          password: "Testando!",
          passwordConfirmation: "Testando1!",
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have
            .property("error")
            .with.equal("Password must have at least one number");
          done();
        });
    });

    it("should give a password error without at least one special character", (done) => {
      chai
        .request(app)
        .post("/auth/register")
        .send({
          ...user,
          password: "Testando1",
          passwordConfirmation: "Testando1",
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have
            .property("error")
            .with.equal("Password must have at least one special character");
          done();
        });
    });

    it("should give a password error of at least eight characters", (done) => {
      chai
        .request(app)
        .post("/auth/register")
        .send({
          ...user,
          password: "Te1!",
          passwordConfirmation: "Te1!",
        })
        .end((error, response) => {
          response.should.have.status(411);
          response.body.should.have
            .property("error")
            .with.equal("Password is too short, minimum is 8 characters");
          done();
        });
    });

    it("should give different password fields error", (done) => {
      chai
        .request(app)
        .post("/auth/register")
        .send({
          name: user.name,
          email: user.email,
          password: user.password,
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have
            .property("error")
            .with.equal("Passwords do not match");
          done();
        });
    });

    it("should give an error that unnecessary data was sent", (done) => {
      chai
        .request(app)
        .post("/auth/register")
        .send({
          ...user,
          prop: "prop",
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have
            .property("error")
            .with.equal("Some unnecessary data was sent");
          done();
        });
    });

    after(async () => {
      await UserModel.deleteOne({
        email: user.email,
      });
    });
  });

  describe("Login", () => {
    before(async () => {
      await UserModel.create(user);
    });

    it("REGISTER: should give a user already registered error", (done) => {
      chai
        .request(app)
        .post("/auth/register")
        .send(user)
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have
            .property("error")
            .with.equal("Email already registered");
          done();
        });
    });

    it("should login a user", (done) => {
      chai
        .request(app)
        .post("/auth/login")
        .send({
          email: user.email,
          password: user.password,
        })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.a("object");
          response.body.should.have.property("user");
          response.body.should.have.property("token");
          done();
        });
    });

    it("should give a required email field error", (done) => {
      chai
        .request(app)
        .post("/auth/login")
        .send({
          password: user.password,
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have
            .property("error")
            .with.equal("Email is required");
          done();
        });
    });

    it("should give a required password field error", (done) => {
      chai
        .request(app)
        .post("/auth/login")
        .send({
          email: user.email,
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have
            .property("error")
            .with.equal("Password is required");
          done();
        });
    });

    it("should give an invalid password error", (done) => {
      chai
        .request(app)
        .post("/auth/login")
        .send({
          email: user.email,
          password: "teste",
        })
        .end((error, response) => {
          response.should.have.status(403);
          response.body.should.have
            .property("error")
            .with.equal("Password is invalid");
          done();
        });
    });

    it("should give an error that unnecessary data was sent", (done) => {
      chai
        .request(app)
        .post("/auth/login")
        .send({
          ...user,
          prop: "prop",
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have
            .property("error")
            .with.equal("Some unnecessary data was sent");
          done();
        });
    });

    it("should give an unregistered user error", (done) => {
      chai
        .request(app)
        .post("/auth/login")
        .send({
          email: "naocadastrado@gmail.com",
          password: "naoCadastrado1!",
        })
        .end((error, response) => {
          response.should.have.status(404);
          response.body.should.have
            .property("error")
            .with.equal("User does not exist");
          done();
        });
    });

    after(async () => {
      await UserModel.deleteOne({
        email: user.email,
      });
    });
  });
});
