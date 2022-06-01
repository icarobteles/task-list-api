import chai from "chai";
import chaiHttp from "chai-http";
import connectToDatabase from "../../src/database/connect.js";
import app from "../../src/routes/index.js";
import dotenv from "dotenv";
import UserModel from "../../src/models/Auth.js";
import { beforeEach } from "mocha";

chai.should();
chai.use(chaiHttp);

beforeEach(async (done) => {
  try {
    dotenv.config();
    await connectToDatabase();
    await UserModel.deleteMany();
    done();
  } catch (error) {
    done(error);
  }
});

describe("Auth Router", () => {
  describe("Register", () => {
    it("should register a user", (done) => {
      chai
        .request(app)
        .post("/auth/register")
        .send({
          name: "Teste",
          email: "teste@gmail.com",
          password: "Testando1!",
          passwordConfirmation: "Testando1!",
        })
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
          email: "teste@gmail.com",
          password: "Testando1!",
          passwordConfirmation: "Testando1!",
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
          name: "Teste",
          password: "Testando1!",
          passwordConfirmation: "Testando1!",
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
          name: "Teste",
          email: "teste@gmail.com",
          passwordConfirmation: "Testando1!",
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have
            .property("error")
            .with.equal("Password is required");
          done();
        });
    });

    it("should give different password fields error", (done) => {
      chai
        .request(app)
        .post("/auth/register")
        .send({
          name: "Teste",
          email: "teste@gmail.com",
          password: "Testando1!",
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.have
            .property("error")
            .with.equal("Passwords do not match");
          done();
        });
    });
  });
});
