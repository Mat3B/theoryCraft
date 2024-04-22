const { MongoClient, ServerApiVersion } = require('mongodb');

// Connection URI
const uri = 'mongodb+srv://smill22:admin@atlascluster.g7txxuo.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster';

// Database Name
const dbName = 'WoodProductsDB';

// Create a new MongoClient
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Connect to the MongoDB server
client.connect(async err => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }

    console.log('Connected to MongoDB');

    const db = client.db(dbName);

    try {
        // Insert documents into the Regions collection
        await db.collection('Regions').insertMany([
            {
                _id: '1',
                name: 'Pacific Northwest',
                mills: [
                    {
                        _id: '101',
                        name: 'ABC Mill',
                        location: 'Oregon',
                        mill_type: 'Sawmill',
                        mill_inputs: [
                            {
                                _id: '201',
                                logger_id: '201',
                                mill_outputs: [
                                    {
                                        _id: '301',
                                        weight_count: 1500,
                                        product_type: 'Lumber'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        _id: '102',
                        name: 'XYZ Mill',
                        location: 'Washington',
                        mill_type: 'Paper Mill',
                        mill_inputs: [
                            {
                                _id: '202',
                                logger_id: '202',
                                mill_outputs: [
                                    {
                                        _id: '302',
                                        weight_count: 2000,
                                        product_type: 'Paper'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]);

        console.log('Documents inserted into Regions collection');

        // Insert documents into the Loggers collection
        await db.collection('Loggers').insertMany([
            {
                _id: '201',
                name: 'Logger1',
                load_weight: 2000
            },
            {
                _id: '202',
                name: 'Logger2',
                load_weight: 3000
            }
        ]);

        console.log('Documents inserted into Loggers collection');
    } catch (err) {
        console.error('Error inserting documents:', err);
    }

    // Close the connection
    client.close();
});