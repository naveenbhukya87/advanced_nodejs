### Blocking and Non-blocking:
- JavaScript is single-threaded, but parallelism and multithreading are possible within Node.js with the help of worker threads. 
- We can make an Express.js server faster with worker threads when the main thread is blocked by heavy computations.
- In server.js blocking api is taking lot more time and it is also blocking non-blocking api to get executed.
- NodeJS works on V8 engine which implements **libuv** library.
- #####libuv 
    - is used to abstract non-blocking I/O operations to a consistent interface across all supported platforms.
    - provides mechanism to handle:
        - file system
        - DNS,
        - network
        - child processes
        - pipes
        - signal handling
        - polling and 
        - streaming.
    - It also includes a thread pool for offloading work for some things that can't be done asynchronously at the OS level.
    - libuv lets the node application to spawn some extra hidden threads. (There 7 threads including main thread).
        - 2 threads are for garbage collection.
        - 4 are there to respond when needed (like I/O like DB, File handling and Network data transmissions)
- Before code:

    **server.js**

    ```
    const express = require('express');
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
        let sum = 0;
        for (let i = 0; i < 20000000000000000000; i++) {
            sum += i;
        }
        res.send({
            message: "Message from blocking",
            count: sum
        });
    });

    app.listen(PORT, () => {
        console.log(`App is up and running on ${PORT}`);
    });
    ```
- Now spans are added: Code changed is:

    **sever.js**

    ```
    const express = require('express');
    //=========workers are added=============//
    const { Worker } = require('worker_threads'); // Correct 
    //=========workers are added=============//
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

        //=========workers are added=============//
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
        //=========workers are added=============//
    });

    app.listen(PORT, () => {
        console.log(`App is up and running on ${PORT}`);
    });
    ```
    **worker.js**
    ```
        const { parentPort } = require('worker_threads');
        let sum = 0;
        for (let i = 0; i < 20000000000000000000; i++) {
            sum += i;
        }

        // Send the result back to the main thread
        parentPort.postMessage(sum);
    ```
sysctl -n hw.ncpu for mac
echo %NUMBER_OF_PROCESSORS%