import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productid: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },

    altName: {
        type: [String],
        default: []
    },

    price: {
        type: Number,
        required: true,
    },

    lablePrice: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    Image: {
        type: [Array],
        default: ["https://www.bing.com/images/search?view=detailV2&ccid=9QX9QucO&id=C61ECB3D755DE23BAF2B0969446739601528DA36&thid=OIP.9QX9QucOeYTqNZYOWx89BwHaE8&mediaurl=https%3a%2f%2fcdn.logojoy.com%2fwp-content%2fuploads%2f20191023114758%2fAdobeStock_224061283-min.jpeg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.f505fd42e70e7984ea35960e5b1f3d07%3frik%3dNtooFWA5Z0RpCQ%26pid%3dImgRaw%26r%3d0&exph=4000&expw=6000&q=biuty+product&simid=608029450280660048&FORM=IRPRST&ck=0B794AC492A12FF6DAB43F62E9F419E5&selectedIndex=0&itb=0"]
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    }
}
);

const productModel = mongoose.model("Product", productSchema);

export default productModel;