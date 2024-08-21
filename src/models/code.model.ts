const mongoose = require("mongoose");
const codeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    language: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    isUsepassword: {
      type: Boolean,
      required: true,
    },
    password: {
      type: String,
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Members",
    },
  },
  {
    timestamps: true,
  }
);

const codeModel = mongoose.model("Codes", codeSchema);
export default codeModel;
