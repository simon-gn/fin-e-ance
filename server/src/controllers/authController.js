const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { id: user.id };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 10 })
    
    const refreshToken = uuidv4();
    await RefreshToken.create({ 
      token: refreshToken, 
      userId: user.id, 
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) 
    });

    return res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const payload = { id: user.id };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 10 });
    
    const refreshToken = uuidv4();
    await RefreshToken.create({ 
      token: refreshToken, 
      userId: user.id, 
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) 
    });

    return res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // Find the refreshToken in the database
    const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenDoc || tokenDoc.revoked) {
      return res.status(403).json({ msg: 'Refresh token is not valid' });
    }

    // Verify the user associated with the refresh token
    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return res.status(403).json({ msg: 'User not found' });
    }

    const payload = { id: user.id };
    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 20 });

    const newRefreshToken = uuidv4();
    await RefreshToken.create({ 
      token: newRefreshToken, 
      userId: user.id, 
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) 
    });

    // Invalidate the old refresh token
    await RefreshToken.updateOne({ token: refreshToken }, { revoked: true });

    return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
