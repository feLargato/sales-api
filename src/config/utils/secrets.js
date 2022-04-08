const env = process.env;


export const MONGO_DB_URL = env.MONGO_DB_URL 
? env.MONGO_DB_URL : "mongodb://admin:root@localhost:27017/admin";

export const apiSecrect = env.API_SECRET
 ? env.API_SECRET : "bWljcm9zc2Vydmljb3MtY29udGFpbmVyLXBhc3N3b3Jk";

 export const RABBIT_MQ_URL = env.RABBIT_MQ_URL
 ? env.RABBIT_MQ_URL : "amqp://localhost:5672";

 export const PRODUCT_API_URL = env.PRODUCT_API_URL 
 ? env.PRODUCT_API_URL : "http://localhost:8081/product-api"