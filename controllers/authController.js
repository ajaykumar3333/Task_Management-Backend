const User = require('../models/User');
const jwt = require('jsonwebtoken');
const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ user, token });
  } catch (err) {
    console.log(err);
    
    res.status(400).json({ message: err.message });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ user, token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};
module.exports = { register, login };