import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import UserModel from "../models/Auth.js";
import { validationPassword } from "../utils/validations/password.js";

const validationUser = async (id) => {
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return { error: "User not found" };
  }

  const user = await UserModel.findById(id)
    .select("+password")
    .populate("tasks");
  if (!user) {
    return { error: "User not found" };
  }

  return user;
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { name, email, newPassword, currentPassword } = req.body;

  const user = await validationUser(id);
  if (user.error) {
    return res.status(404).json(user);
  }

  const keys = Object.keys(req.body);

  if (
    keys.length === 0 ||
    (keys.length === 1 && keys[0] === "currentPassword")
  ) {
    return res
      .status(422)
      .json({ error: "At least one piece of data is required" });
  }

  const possibleKeys = ["name", "email", "currentPassword", "newPassword"];
  keys.forEach((key) => {
    if (!possibleKeys.includes(key)) {
      return res.status(422).json({ error: "Some unnecessary data was sent" });
    }
  });

  if (!currentPassword) {
    return res.status(403).json({ error: "Current password is required" });
  }

  const checkPassword = await bcrypt.compare(currentPassword, user.password);
  if (!checkPassword) {
    return res.status(403).json({ error: "Password is invalid" });
  }

  if (email && !/\S+@\S+\.\S+/.test(email)) {
    return res.status(422).json({ error: "Email is invalid" });
  }

  let password = undefined;
  if (newPassword) {
    const validationPasswordFailed = validationPassword(newPassword);
    if (validationPasswordFailed) {
      return res
        .status(validationPasswordFailed.status)
        .json({ error: validationPasswordFailed.error });
    }

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(newPassword, salt);
    password = hash;
  }

  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      id,
      {
        name,
        email,
        password,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const readById = async (req, res) => {
  const { id } = req.params;

  const user = await validationUser(id);
  if (user.error) {
    return res.status(404).json(user);
  }

  try {
    /*  user.password = undefined; */
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  const { id } = req.params;
  const { password, passwordConfirmation } = req.body;

  const user = await validationUser(id);
  if (user.error) {
    return res.status(404).json(user);
  }

  const keys = Object.keys(req.body);
  if (!password) {
    return res.status(422).json({ error: "Password is required" });
  }

  if (password !== passwordConfirmation) {
    return res.status(422).json({ error: "Passwords do not match" });
  }

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    return res.status(403).json({ error: "Password is invalid" });
  }

  try {
    await user.delete();
    res.status(200).json({ success: "Account removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
