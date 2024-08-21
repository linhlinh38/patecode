const mongoose = require("mongoose");
const tokenSchema = mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Members",
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600,
    },
  },
  {
    timestamps: true,
  }
);

const tokenModel = mongoose.model("Token", tokenSchema);
export default tokenModel;
