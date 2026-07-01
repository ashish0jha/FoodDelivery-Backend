const express = require("express");
const paymentRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/payment");
const PaymentSchema = require("../models/payment");
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const userschema = require("../models/userschema");

paymentRouter.post("/payment/order", userAuth, async (req, res) => {
    try {
        const { amount } = req.body;
        const { _id, fullName, email } = req.user;

        const order = await razorpayInstance.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: "order_rcptid_11",
            notes: {
                fullName,
                email,
            }
        })

        const { id, status, currency, receipt, notes } = order;

        const payment = new PaymentSchema({
            userId: _id,
            orderId: id,
            status,
            amount: order.amount,
            currency,
            receipt,
            notes
        })
        const savedPayment = await payment.save();
        res.json({ ...savedPayment.toJSON(), keyId: process.env.RZP_API_KEY })
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

paymentRouter.post("/payment/webhook", async (req, res) => {
    try {
        const webhookSignature = req.get("X-Razorpay-signature");

        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
            process.env.RZP_WEBHOOK_SECRET,
        )

        if (!isWebhookValid) {
            return res.status(400).json({ message: "Webhook Signature is Invalid" });
        }

        const paymentDetails = req.body.payload.payment.entity;

        const payment = await PaymentSchema.findOne({ orderId: paymentDetails.order_id });

        payment.status = paymentDetails.status;
        await payment.save();

        // TODO : Add here this payment to user's payment history

        return res.status(200).json({ message: "Webhook received sucessfully" })

    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

paymentRouter.get("/payment/verify", userAuth, async (req, res) => {
    try {
        const { _id } = req.user;
        const order = await PaymentSchema.findOne({userId:_id});

        if(order.status==="Paid"){
            return res.json({message:"Payment Done",
                isPaymentDone:true
            })
        }
        return res.json({message:"Payment failed",
            isPaymentDone:false
        })
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = paymentRouter;