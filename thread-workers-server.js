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

const THREAD_COUNT = 4;

function createWorker() {
    return new Promise((resolve, reject) => {
        const worker = new Worker("./four-workers", {
            workerData: {
                thread_count: THREAD_COUNT
            }
        });
        worker.on("message", (data) => {
            resolve(data)
        });

        worker.on("error", (error) => {
            reject({
                message: "Message from blocking",
                count: 0,
                error: error
            });
        });

    })

}

app.get("/blocking", async (req, res) => {
    try {
        const workerPromises = [];
        for (let i = 0; i < THREAD_COUNT; i++) {
            workerPromises.push(createWorker())
        }
        const threadResult = await Promise.all(workerPromises);
        // const data = threadResult[0] + threadResult[1] + threadResult[2] + threadResult[3]
        const data = threadResult.reduce((acc, val) => acc + val, 0)
        res.send({
            message: "Message from blocking",
            count: data
        });
    } catch (error) {
        console.log(error)
        res.send(error);
    }
});

app.listen(PORT, () => {
    console.log(`App is up and running on ${PORT}`);
});
