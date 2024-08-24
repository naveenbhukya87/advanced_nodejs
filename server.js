const express = require('express');
const { Worker } = require('worker_threads'); // Correct import
const morgan = require('morgan')
const app = express();
const PORT = 5000;
app.use(morgan("dev"))

app.get("/non-blocking", async (req, res) => {
    res.send({
        message: "Message from non-blocking",
        count: 0
    });
});

app.get("/blocking", async (req, res) => {
    const worker = new Worker("./worker.js");
    
    worker.on("message", (data) => {
        res.send({
            message: "Message from blocking",
            count: data
        });
    });

    worker.on("error", (data) => {
        res.send({
            message: "Message from blocking",
            count: 0
        });
    });
});

app.listen(PORT, () => {
    console.log(`App is up and running on ${PORT}`);
});
