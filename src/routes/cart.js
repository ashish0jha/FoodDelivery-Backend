const express = require("express");
const { userAuth } = require("../middlewares/auth");
const cartSchema = require("../models/cartSchema");

const cartRouter = express.Router();

cartRouter.get("/cart/view", userAuth, async (req, res) => {
    try {
        const { _id } = req.user;
        const cartItems = await cartSchema.find({ userId: _id });
        res.json({
            cartItems
        })
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
})

cartRouter.post("/cart/addItems", userAuth, async (req, res) => {
    try {
        const { _id } = req.user;
        const { item } = req.body;
        if (!item) {
            throw new Error("Add Something first")
        }

        const userCart = await cartSchema.findOne({ userId: _id });

        if (!userCart) {
            const newCart = new cartSchema({
                userId: _id,
                items: [{ ...item, qty: 1 }],
            });
            await newCart.save();
            return res.json({
                message: "Added Successfully",
                qty: 1
            })
        }

        const isItemAlready = userCart.items.find((itemss) => itemss.id === item.id);

        let qty = 1;
        if (isItemAlready) {
            isItemAlready.qty += 1;
            qty = isItemAlready.qty;
        } else {
            userCart.items.push({ ...item, qty: 1 });
        }

        const newCart = await userCart.save();

        res.json({
            message: "Added Successfully",
            qty: qty,
        })
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

cartRouter.post("/cart/removeItems/:id", userAuth, async (req, res) => {
    try {
        const { _id } = req.user;
        const { id } = req.params;
        const { state } = req.body;

        let userCart = await cartSchema.findOne({ userId: _id });
        if (!userCart) {
            throw new Error("cart is empty");
        }

        let itemToRemove = userCart.items.find((itemss) => itemss.id === id);

        if (!itemToRemove) {
            throw new Error("Item does not exist");
        }
        if (itemToRemove.qty === 1 || state==="btnn") {
            const newItems = userCart.items.filter((itemss) => itemss.id !== id);
            userCart.items = newItems;
            const updated = await userCart.save();
            return res.json({
                message: "Removed permanently",
                cart:updated,
                qty:0,
            })
        }

        itemToRemove.qty -= 1;
        const qty = itemToRemove.qty;
        const updated = await userCart.save();

        return res.json({
            message: "reduced one",
            cart:updated,
            qty
        })

    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
})

cartRouter.delete("/cart/clear", userAuth, async (req, res) => {
    try {
        const { _id } = req.user;
        const cartItems = await cartSchema.findOne({ userId: _id });
        cartItems.items = [];
        await cartItems.save();
        res.json({ message: "cart is cleared" })
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})
module.exports = cartRouter;