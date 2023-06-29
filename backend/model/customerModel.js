const mongoose = require("mongoose");
const { phoneNumberRegex , emailRegex } = require("../utils/helper.js");

//Customer Model Schema
const customerSchema = new mongoose.Schema({

  phoneNumber: {
    type: String,
    allowNull: true
    // match: [phoneNumberRegex, "ph-number is not vald"],
  },
  email: {
    type: String,
    allowNull: true
    // required: [true, "email must not be empty"],
    // match: [emailRegex, "email is not valid"],
  },
  linkedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "contact",
    allowNull: null,
  },
  linkPrecedence: {
    type: String,
    enum: ['primary', 'secondary'],
    default: 'primary',
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
  updatedAt: {
    type: Date,
    default : new Date(Date.now())
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default : null
  },
  // secondaryContacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'contact' }],
});

module.exports = mongoose.model("contact", customerSchema);
