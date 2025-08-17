const express = require('express');
const router = express.Router();
const userAuth = require('../Middleware/authMiddleware');
const ConnectionRequest = require('../Models/connectionRequest');
const User = require('../Models/user');

router.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const status = req.params.status;
    const toUserId = req.params.toUserId;

    const allowStatus = ['interested', 'ignored'];

    if (!allowStatus.includes(status)) {
      return res
        .status(400)
        .json({ message: 'invalid status type: ' + status });
    }

    //cross checking
    const existingUser = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Connection request already exist' });
    }

    //toUser cannot duplicated
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({ message: 'Not found user' });
    }

    if (fromUserId.equals(toUserId)) {
      return res.status(400).json({ message: 'cannot make requset your self' });
    }

    const conectionRequest = new ConnectionRequest({
      fromUserId,
      status,
      toUserId,
    });

    const data = await conectionRequest.save();
    res.json({
      message: 'connection request send successfully',
      data,
    });
  } catch (err) {
    res.status(400).send('Error ' + err.message);
  }
});

router.post(
  '/requset/review/:status/:requestId',
  userAuth,
  async (req, res) => {
    try {
      const loggedUser = req.user;
      const { status, requestId } = req.params;

      const checkRequestStatus = ['accepted', 'rejected'];
      if (!checkRequestStatus.includes(status)) {
        return res.status(400).json({ message: 'invalid status' });
      }

      const checkConnectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedUser._id,
        status: 'interested',
      })

      if (!checkConnectionRequest) {
        return res
          .status(400)
          .json({ message: 'connection request not found' });
      }


      checkConnectionRequest.status = status;
      const data = await checkConnectionRequest.save();

      res.json({
        message: 'connection request ' + status,
        data,
      });
    } catch (err) {
      res.status(400).send('Error: ' + err.message);
    }
  },
);

module.exports = router;
