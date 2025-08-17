const express = require('express');
const router = express.Router();
const userAuth = require('../Middleware/authMiddleware');
const ConnectionRequest = require('../Models/connectionRequest');
const { route } = require('./profile');
const User = require('../Models/user');

const CHECK_DATA = 'firstName lastName profile age gender photoUrl skills';
router.get('/users/request/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const checkPendingRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', CHECK_DATA);

    if (!checkPendingRequest) {
      res.send('no pending request');
    }

    res.json({ data: checkPendingRequest });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.get('/users/connections', userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedUser._id, status: 'accepted' },
        { toUserId: loggedUser._id, status: 'accepted' },
      ],
    })
      .populate('fromUserId', CHECK_DATA)
      .populate('toUserId', CHECK_DATA);

    const data = connectionRequest.map((field) => {
      if (field.fromUserId._id.toString() === loggedUser._id.toString()) {
        return field.toUserId;
      }
      return field.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send('Error:' + err.meesage);
  }
});

router.get('/feed', userAuth, async (req, res) => {
  try {
      const loggedUser = req.user

      const connectionRequest = await ConnectionRequest.find({
        $or:[
            {fromUserId:loggedUser._id},
            {toUserId:loggedUser._id}
        ]
      }).select(CHECK_DATA).populate("fromUserId","firstName").populate("toUserId","firstName")

      const hideDataFromFeed = new Set()

      connectionRequest.map((field)=>{
        hideDataFromFeed.add(field.fromUserId._id)
        hideDataFromFeed.add(field.toUserId._id)
      })

      const user = await User.find({
        $and:[
            {_id:{$nin: Array.from(hideDataFromFeed)}},
            {_id:{$ne: loggedUser._id}}
        ]
      }).select(CHECK_DATA)

      res.send(user)
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

module.exports = router;
