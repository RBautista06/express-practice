import { Router } from "express";

const router = Router();

router.get("/api/products", (req, res) => {
  if (req.signedCookies.hello && req.signedCookies.hello === "world")
    return res.send([
      { id: 123, name: "Chicken Breast", price: 12.99 },
      { id: 456, name: "Dragon Breast", price: 10.99 },
    ]);
  return res.send("Sorry you need to have Cookies");
});

export default router;
