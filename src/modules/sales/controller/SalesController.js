import SalesService from "../service/SalesService.js";

class SalesController {

    async createSale(req, res) {
        let sale = await SalesService.createSale(req);
        return res.status(sale.status).json(sale);
    }

    async findById(req, res) {
        let sale = await SalesService.findById(req);
        return res.status(sale.status).json(sale);
    }

    async findAll(req, res) {
        let sale = await SalesService.findAll(req);
        return res.status(sale.status).json(sale);
    }

    async findByProductId(req, res) {
        let sale = await SalesService.findByProductId(req);
        return res.status(sale.status).json(sale);
    }
}

export default new SalesController();