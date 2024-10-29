const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ name, email, password });

    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);

    await user.save();

    const payload = { id: user.id };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 })
    
    const refreshToken = uuidv4();
    await RefreshToken.create({ 
      token: refreshToken, 
      userId: user.id, 
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) 
    });

    return res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const payload = { id: user.id };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });
    
    const refreshToken = uuidv4();
    await RefreshToken.create({ 
      token: refreshToken, 
      userId: user.id, 
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) 
    });

    return res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenDoc || tokenDoc.revoked) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    if (tokenDoc.expiresAt < Date.now()) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    // TODO: check if tokenDoc.userId matches the Id of the user that requests the new token

    const payload = { id: user.id };
    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });

    const newRefreshToken = uuidv4();
    await RefreshToken.create({ 
      token: newRefreshToken, 
      userId: user.id, 
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) 
    });

    // Invalidate the old refresh token
    await RefreshToken.updateOne({ token: refreshToken }, { revoked: true });

    return res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.validateToken = async(req, res) => {
  return res.status(200).json({ valid: true });
};
