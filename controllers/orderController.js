import orderModel from "../models/order.js";
import productModel from "../models/product.js";
export async function createOrder(req, res) {
  if (req.user == null) {
    res.status(401).json({ message: "you need to login first" });
    return;
  }
  const body = req.body;
  const orderData = {
    orderId: "",
    email: req.user.email,
    name: body.name,
    address: body.address,
    phoneNumber: body.phoneNumber,
    billItems: [],
    total: 0,
  };
  orderModel
    .find()
    .sort({ date: -1 })
    .limit(1)
    .then(async (lastBills) => {
      if (lastBills.length == 0) {
    orderData.orderId = "ORD0001";
  } else {
    const lastBill = lastBills[0];
    const lastOrderId = lastBill.orderId;
    const laseOrderNumber = lastOrderId.replace("ORD", "");
    const laseOrderNumberInt = parseInt(laseOrderNumber);
    const newOrderNumberInt = laseOrderNumberInt + 1;
    const newOrderNumberStr = "ORD" + newOrderNumberInt.toString().padStart(4, "0");
    orderData.orderId = newOrderNumberStr;
  }

  for (let i = 0; i < body.billItems.length; i++) {
      // support both `productid` and `productId` from client payload
      const requestedProductId = body.billItems[i].productid ?? body.billItems[i].productId;
      const product = await productModel.findOne({ productid: requestedProductId });
      if(product == null) {
        res.status(404).json({ message: "Product with id " + requestedProductId + " not found" });
        return;
      }
      /* productid: String,
        ProductName: String,
        Image: String,
        quantity: Number,
        price: Number*/
      // safely extract first image even if Image is nested arrays
      let firstImage;
      if (Array.isArray(product.Image)) {
        if (Array.isArray(product.Image[0])) {
          firstImage = product.Image[0][0];
        } else {
          firstImage = product.Image[0];
        }
      } else {
        firstImage = product.Image;
      }

      orderData.billItems[i] = {
            productId: product.productid,
            ProductName: product.name,
            Image: firstImage,
            quantity: body.billItems[i].quantity,
            price: product.price
      };
      orderData.total = orderData.total + product.price * body.billItems[i].quantity;
  }
  const order = new orderModel(orderData);
  

  order
    .save()
    .then(() => {
      res.json({
        message: "Order created successfully",
        
      });
      // Update product quantity
     /* order.billItems.forEach((item) => {
        productModel.findOne({ productid: item.productId }).then((product) => {
          if (product) {
            product.quantity -= item.quantity;
            product.save();
          }
      })
      });*/
    })
    .catch((err) => {
      console.error("Error creating order:", err);
      res
        .status(500)
        .json({ message: "Error creating order", error: err.message });
    });
    });
  
}

export function getOrders(req, res) {
  if(req.user == null) {
    res.status(401).json({ message: "you need to login first" });
    return;
  }
  if(req.user.rol=="admin") {
    orderModel.find().then((orders) => {
      res.json(orders);
    }).catch((err) => {
      console.error("Error getting orders:", err);
      res.status(500).json({ message: "Error getting orders", error: err.message });
    });
  }
  else{
    orderModel.find({
      email: req.user.email
    }).then((orders) => {
      res.json(orders);
    }).catch((err) => {
      console.error("Error getting orders:", err);
      res.status(500).json({ message: "Error getting orders", error: err.message });
    })
  }
}