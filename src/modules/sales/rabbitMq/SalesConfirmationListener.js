import amqp from "amqplib/callback_api.js";
import { RABBIT_MQ_URL } from "../../../config/utils/secrets.js";
import SalesService from "../service/SalesService.js";
import { SALES_CONFIRMATION_QUEUE } from "../../../config/rabbitmq/Queue.js";

export function ListenSalesconfirmationQueue() {
    amqp.connect(RABBIT_MQ_URL, (error, connection) => {
        if(error) {
            throw error;
        }
        console.info("Listening to sales.confirmation.queue")
        connection.createChannel((error, channel) => {
          if(error) {
            throw error;
          }
          channel.consume(SALES_CONFIRMATION_QUEUE, (message) => {
              console.info(`Receiving message from queue: ${message.content.toString()}`);
              SalesService.updateSales(message.content.toString());
          }, {
            noAck: true,
          });  
        });
    });    
    

} 