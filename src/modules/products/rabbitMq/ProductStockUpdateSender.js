import amqp from "amqplib/callback_api.js";
import { RABBIT_MQ_URL } from "../../../config/utils/secrets.js";
import { PRODUCT_TOPIC, PRODUCT_STOCK_UPDATE_ROUTING_KEY } from "../../../config/rabbitmq/Queue.js";

export function sendMessageToProductStockUpdateQueue(message) {
    amqp.connect(RABBIT_MQ_URL, (error, connection) => {
        if(error) {
            throw error;
        }
        console.info("Listening to sales.confirmation.queue")
        connection.createChannel((error, channel) => {
          if(error) {
            throw error;
          }
          message = JSON.stringify(message);
          console.info(`Sending message to product.update.stock: ${message}`);
          channel.publish(
              PRODUCT_TOPIC,
              PRODUCT_STOCK_UPDATE_ROUTING_KEY,
              Buffer.from(message) 
          );  
          console.info("Message sent")
        });
    });    
}