const Notification = require('../models/Notification');
const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id });
  res.json(notifications);
};
module.exports = { getNotifications };