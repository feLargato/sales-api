import Sales from "../model/Sales.js";

class SalesRepository {

    async save(sales) {
        try {
            return await Sales.create(sales);
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    async findAll() {
        try {
            return await Sales.find();
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    async findByProductId(productId) {
        try {
            return await Sales.find({ "products.productId": Number(productId) });
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    async findById(id) {
        try {
            return await Sales.findById(id);
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }



}

export default new SalesRepository();