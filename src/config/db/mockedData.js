import Sales from "../../modules/sales/model/Sales.js"

export async function createMockedData() {

    await Sales.collection.drop();
    await Sales.create({
        products: [
          {
            productId: 100,
            quantity: 2,                    
          },
          {
            productId: 200,
            quantity: 2,   
          }, 
                  ],
        user: {
            id: 'fasdfasdfasd',
            name: "fernando",
            email: 'fernando@gmail.com',
        },
        status: 'APPROVED',
        createdAt: new Date(),
        updatedAt: new Date()
    });
    await Sales.create({
        products: [
          {
            productId: 300,
            quantity: 2,                    
          },
          {
            productId: 400,
            quantity: 2,   
          }, 
        ],
        user: {
            id: 'fasdfasdfasd',
            name: "carla",
            email: 'carla@gmail.com',
        },
        status: 'REJECTED',
        createdAt: new Date(),
        updatedAt: new Date()
    });

    let mockedData = await Sales.find();
    console.info(`Mocked data: ${JSON.stringify(mockedData, undefined, 4)}`);
}