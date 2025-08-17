const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    toUserId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    status: {
      type: String,
      enum: {
        values: ['interested', 'ignored', 'accepted', 'rejected'],
        message: '{VALUE} status is not match',
      },
      require: true,
    },
  },
  { timestamps: true },
);

// connectionRequestSchema.pre('save', async function(next){
//     const connectionRequest = this
//     if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
//         throw new Error("cannot make request your self!")
//     }

//     next()
// })

const ConnectionRequest = mongoose.model(
  'ConnectionRequest',
  connectionRequestSchema,
);

module.exports = ConnectionRequest;
