const { parentPort } = require('worker_threads');

let sum = 0;
for (let i = 0; i < 200000000000; i++) {
    sum += i;
}

// Send the result back to the main thread
parentPort.postMessage(sum);