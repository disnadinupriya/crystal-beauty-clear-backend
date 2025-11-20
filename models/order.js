import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  billItems: {
    type: [
      {
        productid: String,
        ProductName: String,
        /* Image: {
        type: [Array],
        default: ["https://www.bing.com/images/search?view=detailV2&ccid=9QX9QucO&id=C61ECB3D755DE23BAF2B0969446739601528DA36&thid=OIP.9QX9QucOeYTqNZYOWx89BwHaE8&mediaurl=https%3a%2f%2fcdn.logojoy.com%2fwp-content%2fuploads%2f20191023114758%2fAdobeStock_224061283-min.jpeg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.f505fd42e70e7984ea35960e5b1f3d07%3frik%3dNtooFWA5Z0RpCQ%26pid%3dImgRaw%26r%3d0&exph=4000&expw=6000&q=biuty+product&simid=608029450280660048&FORM=IRPRST&ck=0B794AC492A12FF6DAB43F62E9F419E5&selectedIndex=0&itb=0"]
    },*/
        Image: String,
        quantity: Number,
        price: Number,
      },
    ],
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const orderModel = mongoose.model("order", orderSchema);
export default orderModel;
