const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//____________________ createUser
const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json("user created");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//____________________ geAllUser
const geAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: "the all users", users });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//____________________ Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "you must provide email and password" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "invalid email or password" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "invalid email or password" });
    }
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.SERCERT_KEY,
      { expiresIn: "3h" }
    );
    res.status(200).json({ message: "login success", token });
  } catch (err) {
    res.status(500).json(err);
  }
};

//____________________ getUserById
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User found", user });
  } catch (err) {
    res.status(500).json(err);
  }
};

//____________________ updateUser
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 15);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json(err);
  }
};

//____________________ deleteUser
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createUser,
  geAllUser,
  login,
  getUserById,
  updateUser,
  deleteUser,
};
