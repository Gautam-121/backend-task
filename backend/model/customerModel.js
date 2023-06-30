const mongoose = require("mongoose");

//Customer Model Schema
const customerSchema = new mongoose.Schema({

  phoneNumber: {
    type: String,
    allowNull: true,
    default : null
  },
  email: {
    type: String,
    allowNull: true,
    default : null
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
});

module.exports = mongoose.model("contact", customerSchema);
