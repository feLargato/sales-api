import { Router } from "express";

import SalesController from "../controller/SalesController.js";

const router = new Router();

router.get("/sales-api/sale/", SalesController.findAll);
router.get("/sales-api/sale/product/:productId", SalesController.findByProductId);
router.get("/sales-api/sale/:id", SalesController.findById);
router.post("/sales-api/sale/create", SalesController.createSale);

export default router;