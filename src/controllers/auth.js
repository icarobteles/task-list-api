import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import UserModel from "../models/Auth.js";
import { validationPassword } from "../utils/validations/password.js";

const generateToken = (params = {}) => {
  const secret = process.env.SECRET;
  const token = jsonwebtoken.sign(params, secret, {
    expiresIn: 86400,
  });

  return token;
};

export const register = async (req, res) => {
  const { name, email, password, passwordConfirmation } = req.body;

  //Validations
  if (!name) {
    return res.status(422).json({ error: "Name is required" });
  }
  if (!email) {
    return res.status(422).json({ error: "Email is required" });
  }
  //Verificação simples, não é a melhor opção!
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(422).json({ error: "Email is invalid" });
  }

  const validationPasswordFailed = validationPassword(password);
  if (validationPasswordFailed) {
    return res
      .status(validationPasswordFailed.status)
      .json({ error: validationPasswordFailed.error });
  }

  if (password !== passwordConfirmation) {
    return res.status(422).json({ error: "Passwords do not match" });
  }

  const possibleKeys = ["name", "email", "password", "passwordConfirmation"];
  Object.keys(req.body).forEach((key) => {
    if (!possibleKeys.includes(key)) {
      return res.status(422).json({ error: "Some unnecessary data was sent" });
    }
  });

  //Check if email has already been registered
  const userExists = await UserModel.findOne({ email: email });
  if (userExists) {
    return res.status(422).json({ error: "Email already registered" });
  }

  try {
    const user = await UserModel.create({ name, email, password });
    user.password = undefined;
    res.status(201).json({ user, token: generateToken({ id: user._id }) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({ error: "Email is required" });
  }
  if (!password) {
    return res.status(422).json({ error: "Password is required" });
  }

  const user = await UserModel.findOne({ email: email })
    .select("+password")
    .populate("tasks");
  if (!user) {
    return res.status(404).json({ error: "User does not exist" });
  }

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    return res.status(403).json({ error: "Password is invalid" });
  }

  const possibleKeys = ["email", "password"];
  Object.keys(req.body).forEach((key) => {
    if (!possibleKeys.includes(key)) {
      return res.status(422).json({ error: "Some unnecessary data was sent" });
    }
  });

  try {
    user.password = undefined;
    res.status(200).json({ user, token: generateToken({ id: user._id }) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
