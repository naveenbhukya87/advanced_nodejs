const { workerData, parentPort } = require('worker_threads');

let sum = 0;
for (let i = 0; i < 20000000000/workerData.thread_count; i++) {
    sum += i;
}

// Send the result back to the main thread
parentPort.postMessage(sum);