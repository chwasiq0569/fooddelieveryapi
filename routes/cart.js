const router = require("express").Router();
const Cart = require("../model/Cart");

router.post("/:userId", async (req, res) => {
  const cart = await Cart.findOne({ user: req.params.userId });
  if (cart) {
    console.log("IF");
    let itemExists = cart.cartItems.find(
      (item) => item.product == req.body.cartItem.product
    );
    // { "cartItems.product": req.body.cartItem.product },
    if (itemExists) {
      console.log("INNER IF");
      const item = await Cart.findOneAndUpdate(
        {
          user: req.params.userId,
          "cartItems.product": req.body.cartItem.product,
        },
        {
          $set: {
            "cartItems.$": {
              ...req.body.cartItem,
              quantity: itemExists.quantity + req.body.cartItem.quantity,
              price: itemExists.price + req.body.cartItem.price,
            },
          },
        }
      );
      res.json({ status: 1, data: item });
    } else {
      console.log("INNER ELSE");
      const item = await Cart.findOneAndUpdate(
        { user: req.params.userId },
        {
          $push: {
            cartItems: req.body.cartItem,
          },
        }
      );
      res.json({ status: 1, data: item });
    }
  } else {
    console.log("ELSE");
    const cart = new Cart(req.body);
    cart.cartItems.push(req.body.cartItem);
    await cart.save();
    res.json({ status: 1, data: cart });
  }
});

router.get("/", async (req, res) => {
  return res.json({ status: 1, data: "NAMES" });
});

module.exports = router;
