import express from "express";
import OrderModel from "../models/oder.js";


/*
export function createOrder(req, res) {

    if (req.user == null) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const body = req.body;
    const orderData = {
        orderId: "",
        email: req.user.email,
        name: body.name,
        address: body.address,
        phonNumber: body.phonNumber,
        billItems: [],
        total: 0
    };
    OrderModel.find().sort({
        date: -1
    }).limit(1).then((lastbills) => {

        if (lastbills.length == 0) {
            orderData.orderId = "ORD-0001";
        }
        else {
            const lastbill = lastbills[0];

            const lastOrderId = lastbill.orderId;//BILL-0001
            const lastOrderNumber = lastOrderId.replace("ORD-", "")//001
            const lastOrderNumberInt = parseInt(lastOrderNumber);// 1
            const newOrderNumberInt = lastOrderNumberInt + 1;// 2

            const newOrderNumberStr = newOrderNumberInt.toString().padStart(4, "0"); // "0002"
            orderData.orderId = "ORD-" + newOrderNumberStr;
        }

        const order = new OrderModel(orderData);
        order.save().then(() => {
            res.json({
                message: "Order saved successfully"
            });
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                message: "Order not saved"
            })
        })

    }
    )
}*/

export function createOrder(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const body = req.body;

    const orderData = {
        oderId: "",
        email: req.user.email,
        name: body.name,
        address: body.address,
        phonNumber: body.phonNumber,
        billItems: [],// Assuming billItems will be populated later
        total: body.total
    };

    OrderModel.find().sort({ date: -1 }).limit(1).then((lastOrders) => {
        if (lastOrders.length === 0) {
            orderData.oderId = "ORD-0001";
        } else {
            const lastOrder = lastOrders[0];
            const lastOrderNumber = parseInt(lastOrder.oderId.replace("ORD-", ""));
            const newOrderNumber = lastOrderNumber + 1;
            orderData.oderId = "ORD-" + newOrderNumber.toString().padStart(4, "0");
        }



        const order = new OrderModel(orderData);
        return order.save();
    }).then(() => {
        res.json({ message: "Order saved successfully" });
    }).catch((err) => {
        console.error("Error saving order:", err);
        res.status(500).json({ message: "Order not saved" });
    });
}
export function getOrders(req, res) {
    if (req.user == null) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // user is admin, fetch all orders
    if (req.user.role == 'admin') {
        OrderModel.find().then((order) => {
            res.json(order);
        }).catch((err) => {
            console.error("Order not found:", err);
            res.status(500).json({ message: "Order not found" });
        });
    } else {
        // user is not admin, fetch only user's orders
        OrderModel.find({ email: req.user.email })
            .then((order) => {
                res.json(order);
            }).catch((err) => {
                console.error("Order not found:", err);
                res.status(500).json({ message: "Order not found" });
            });
    }
}
