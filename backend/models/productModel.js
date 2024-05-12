const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  tag: {
    type: String,
    default: "Normal",
    enum: ["Normal", "Hot", "Super Hot"],
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Approved", "Rejected"],
  },
  title: {
    type: String,
    required: [true, "Please Enter product Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter product Description"],
  },
  furnished: {
    type: String,
    enum: ["Furnished", "Unfurnished"],
  },
  bedrooms: {
    type: String,
  },
  bathrooms: {
    type: String,
  },
  noOfStoreys: {
    type: String,
  },
  constructionState: {
    type: String,
    enum: ["Grey Structure", "Finished"],
  },
  type: {
    type: String,
    // enum:["Office","Shop","Warehouse","Factory","Building"]
  },
  features: [
    {
      type: String,
    },
  ],
  make: {
    type: String,
  },
  model: {
    type: String,
  },
  year: {
    type: Number,
  },
  kmsDriven: {
    type: Number,
  },
  fuelType: {
    type: String,
  },
  floorLevel: {
    type: String,
  },
  areaUnit: {
    type: String,
    enum: ["Kanal", "Marla", "Square Feet", "Square Meter", "Square Yards"],
  },
  area: {
    type: Number,
  },
  price: {
    type: Number,
    required: [true, "Please Enter product Price"],
    maxLength: [10, "Price cannot exceed 10 digits"],
  },
  images: {
    featuredImg: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    imageOne: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    imageTwo: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    imageThree: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },

  },
  category: {
    type: String,
    required: [true, "Please Enter Product Category"],
    enum: ["Property", "Vehicles", "MiscProducts"],
  },
  subCategory: {
    type: String,
    required: [true, "Please Enter Product Sub-Category"],
    enum: ["Land & Plots", "Houses", "Apartments & Flats", "Shops - Offices - Commercial Space", "Portions & Floors", "Cars", "Bikes", "Buses, Vans & Trucks", "Rickshaw & Chingchi", "Tractors & Trailer", "Other Vehicles", "Other Products"],
  },
  location: {
    province: {
      type: "String",
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  bidStatus: {
    type: String,
    required: true,
    default: "Live",
    enum: ["Live", "Pending", "Expired"],
  },
  bidTime: {
    type: String,
    required: [true, "Please specify your bid time"],
  },
  endDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});


//Calculating End Date
productSchema.pre("save", async function (next) {
  if (!this.isModified("bidTime")) {
    next();
  }
  this.endDate = new Date(new Date().getTime() + ((Number(this.bidTime)) * 24 * 60 * 60 * 1000));
});

module.exports = mongoose.model("Product", productSchema);
