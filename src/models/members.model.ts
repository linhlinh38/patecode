const mongoose = require("mongoose");
const memberSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    yob: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const memberModel = mongoose.model("Members", memberSchema);
export default memberModel;
