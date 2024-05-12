const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  bidItem: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
  bidders: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      price: {
        type: Number,
        required: [true, "Please enter your bid price"],
      },
      bidAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

bidSchema.methods.createBid = async function (user, price) {
  try {
    this.bidders = await this.bidders.concat({ user, price });
    return this.bidders;
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongoose.model("Bid", bidSchema);
