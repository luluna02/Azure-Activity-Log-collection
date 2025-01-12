const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());

var db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    ssl: { ca: fs.readFileSync(process.env.DB_SSL_CERT) }
});


db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    } else {
        console.log('Connected to MySQL');
    }
});

app.get('/', (req, res) =>{
    console.log('Get request');
    res.status(200).json({ message: "OK" });

});

async function insertIntoDatabase(activityLog) {
    const insertQuery = `
        INSERT INTO resource_created (
            caller, level, submissionTimestamp, eventDataId, correlationId,
            operationId, operationName, resourceId, resourceGroupName,
            subscriptionId, tenantId, status, properties, resourceType
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        activityLog.caller,
        activityLog.level,
        activityLog.submissionTimestamp,
        activityLog.eventDataId,
        activityLog.correlationId,
        activityLog.operationId,
        activityLog.operationName,
        activityLog.resourceId,
        activityLog.resourceGroupName,
        activityLog.subscriptionId,
        activityLog.tenantId,
        activityLog.status,
        JSON.stringify(activityLog.properties),
        activityLog.resourceType
    ];

    return new Promise((resolve, reject) => {
        db.query(insertQuery, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}



app.post('/', async (req, res) => {
    try {
        const alertData = req.body;
        if (!alertData || !alertData.data || !alertData.data.context || !alertData.data.context.activityLog) {
            console.log('Invalid request data');
            return res.status(400).json({ message: "Invalid request data" });
        }
        const activityLog = alertData.data.context.activityLog;

        if (activityLog.status === 'Succeeded') {
            console.log('Received alert');
            try {
                const result = await insertIntoDatabase(activityLog);
                console.log('Data inserted into MySQL:', result);
                res.status(200).json({ message: "Data inserted into MySQL", result: alertData });
            } catch (err) {
                console.error('Error inserting data into MySQL:', err);
                res.status(500).json({ message: "Error inserting data into MySQL", error: err });
            }
        }
        else {
            return res.status(200).json({ message: "Activity log status is still not 'Succeeded'"});
        }
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ message: "Unexpected error occurred", error: err });
    }
});


app.listen(port,'0.0.0.0', () => {
    console.log(`Webhook server running at port ${port}`);
});
