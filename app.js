import express from 'express';

import { connectDb } from './src/config/db/mongoDb.js';
import { createMockedData } from './src/config/db/mockedData.js';
import checkToken from './src/config/auth/checkToken.js'
import { connectMq } from './src/config/rabbitmq/rabbitConfig.js'
import { sendMessageToProductStockUpdateQueue } from './src/modules/products/rabbitMq/ProductStockUpdateSender.js';
import salesRoutes from "./src/modules/sales/routes/SaleRoutes.js";
const app = express();
const env = process.env;
const PORT = env.PORT || 8082;
const CONTAINER_ENV = "container";

startApplication();

async function startApplication() {
    if(CONTAINER_ENV === env.NODE_ENV) {
        console.info("witing creation of rabbitMq and mongoDb containers");
        setInterval(() => {
            connectDb();
            connectMq();
        }, 180000);
    }
    else{
        connectDb;
        createMockedData();
        connectMq();

    }
}

app.get("/sales-api/createmock", (req, res) => {
    createMockedData();
    return res.json({message: "created data"})
});

app.use(express.json());
app.use(checkToken);
app.use(salesRoutes);


app.get("/sales-api", (req, res) => {
        return res.status(200).json({
        service: "sales-api",
        status: "up",
        httpstatus: 200,
    })
});

app.listen(PORT, () => {
    console.info(`Server started at port ${PORT}`);
})