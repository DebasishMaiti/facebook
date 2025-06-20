const User = require('../Model/User');

exports.createOrUpdateUser = async (req, res) => {
  try {
    const { facebookId, facebookPageId, facebookPageAccessToken } = req.body;
    console.log(facebookId, facebookPageId, facebookPageAccessToken);
    
    if (!facebookId || !facebookPageId || !facebookPageAccessToken) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let user = await User.findOne({ facebookId });

    if (user) {
      user.facebookPageId = facebookPageId;
      user.facebookPageAccessToken = facebookPageAccessToken;
      await user.save();  
    } else {   
      user = new User({
        facebookId,
        facebookPageId,
        facebookPageAccessToken
      });
      await user.save();
    }
    
    res.status(200).json({ message: 'User saved successfully', user });
  } catch (error) {
    console.error('Error saving user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted', user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
