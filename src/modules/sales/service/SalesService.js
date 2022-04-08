import SalesRepository from "../repository/SalesRepository.js";
import { ACCEPTED, REJECTED, PENDING } from "../../../config/utils/Status.js";
import { sendMessageToProductStockUpdateQueue } from "../../products/rabbitMq/ProductStockUpdateSender.js";
import { INTERNAL_SERVER_ERROR, OK } from "../../../config/utils/HttpStatus.js";
import { BAD_REQUEST } from "../../../config/utils/HttpStatus.js";
import ProductClient from "../../products/client/client.js";
import SalesException from "../exception/SalesException.js";


class SalesService {

    async createSale(req) {
        try {
            let salesData = req.body;
            const { authenticatedUser } = req;
            const { authorization } = req.headers;

            let sales = this.createOrderData(salesData, authenticatedUser);
            this.validateSaleData(salesData);
            await this.validateStock(sales, authorization);
            let savedSale = await SalesRepository.save(sales);
            this.sendMessage(savedSale);
            
            return {
              status: OK,
              savedSale,
            };
        } catch (error) {
            return {
                status: error.status ? error.status : INTERNAL_SERVER_ERROR,
                message: error.message,
            };
        }
    }

    createOrderData(salesData, authenticatedUser) {
        return {
            status: PENDING,
            user: authenticatedUser,
            createdAt: new Date(),
            updatedAt: new Date(),
            products: salesData.products,
        };
    }

    async findById(req) {
        try {
          const {id} = req.params;
          this.validateInformedId(id);
          const existingSale = await SalesRepository.findById(id);
          if(!existingSale) {
              throw new SalesException(BAD_REQUEST, "Sale not found");
          }
          return {
              status: OK,
              existingSale,
            };
        } catch (error) {
            return {
                status: error.status ? error.status : INTERNAL_SERVER_ERROR,
                message: error.message,
            };
        }
    }

    async findAll() {
        try {
          const sales = await SalesRepository.findAll();
          if(!sales) {
              throw new SalesException(BAD_REQUEST, "Sales not found");
          }
          return {
              status: OK,
              sales,
            };
        } catch (error) {
            return {
                status: error.status ? error.status : INTERNAL_SERVER_ERROR,
                message: error.message,
            };
        }
    }

    async findByProductId(req) {
        try {
          const { productId } = req.params;
          this.validateInformedId(productId);
          const sales = await SalesRepository.findByProductId(productId.split("$")[1]);
          if(!sales) {
              throw new SalesException(BAD_REQUEST, "Sales not found");
          }
          return {
              status: OK,
              salesId: sales.map((sale) => {
                  return sale.id;
              }),
            };
        } catch (error) {
            return {
                status: error.status ? error.status : INTERNAL_SERVER_ERROR,
                message: error.message,
            };
        }
    }

    async updateSales(message) {
        try {
            const sales = JSON.parse(message);
            if(sales.salesId && sales.status) {
                let existingSale = await SalesRepository.findById(sales.salesId);
                if(existingSale && sales.status !== existingSale.status) {
                    existingSale.status = sales.status;
                    existingSale.updatedAt = new Date();
                    const newSale = await SalesRepository.save(existingSale);
                    return newSale;
                }
            }
            else {
                console.warn("The order message was interrupted")
            }
        } catch (error) {
            console.error(`Error occurred while parsing order message from queue: ${error.message}`);
            
        }
    }

    validateInformedId(id) {
        if(!id) {
            throw new SalesException(BAD_REQUEST, "Sales id must be informed");
        }
    }

    validateSaleData(sale) {
        if(!sale.products || !sale) {
            throw new SalesException(BAD_REQUEST, "Product data must be informed");
        }
    }

    async validateStock(sale, token) {
        let outOfStock = await ProductClient.checkStock(sale, token);
        if(!outOfStock) {
            throw new SalesException(BAD_REQUEST, "This product is out of stock");
        }
    }

    sendMessage(savedSale) {
        const message = {
            salesId: savedSale.id,
            products: savedSale.products,
        }
        sendMessageToProductStockUpdateQueue(message);
    }
}

export default new SalesService();