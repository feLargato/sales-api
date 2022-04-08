import axios from "axios";
import { PRODUCT_API_URL } from "../../../config/utils/secrets.js";

class ProductClient {
    
    async checkStock(productsData, token) {
        try{
            console.info(`Sending request to product-api to check stock. Request: 
            ${JSON.stringify(productsData)}`)
            const headers =  {
                Authorization: token,
            };
            let response = false;

            await axios.post(`${PRODUCT_API_URL}/product/check-stock`,
                { products: productsData.products },    
                { headers },
                )
            .then(res => {
                
                response = true;
            })
            .catch((error) => {
                console.error(error.message);
                response = false;
            });
            return response;
        } 
        catch(error) {
            return false;
        }
    }
}


export default new ProductClient();