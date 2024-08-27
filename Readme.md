# NodeJS
src: The Coding Classroom.
- ### Introduction:
    - Node.js is a javascript runtime built on Google's open source V8 javascript engine.
    - It can be used to build fast, highly scalable network applications (back-end).
- ### Pros:
    - Single-threaded, based on event driven, non-blocking I/O model which makes NodeJS lightweight and efficient.
    - Perfect for building **fast** and **scalable** data-intensive apps which makes it 
        - fit for building apps like:
            - API with database behind it (preferbly NoSQL).
            - Data streaming (think Youtube)
            - Real-time chat application.
            - Server side web application.
        - not fit for apps:
            - with heavy server-side processing (CPU-intensive) like having image manipulation, video conversion, file compression or anything like that. (PHP and Python, Ruby on rails are good for these). 
    - Companies like **Netflix**, **Paypal**, **UBER**, have started using node in production.
    - Javascript can be used across the entire stack: faster and more efficient development.
    - **NPM**: huge library of open-source packages available for everyone for free.
    - Very active developer community.


- ### REPL:
    - Read: to read 
    - Eval: Evaluate
    - Print: print to console
    - Loop: return and read

### Blocking and Non-blocking (Synchronous and Asynchronous) :
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
- using threads, tidious processes can be done very fastily. And the code is as follows:

    **thread-workers.js**
    ```
    const { workerData, parentPort } = require('worker_threads');
    let sum = 0;
    for (let i = 0; i < 20000000000/workerData.thread_count; i++) {
        sum += i;
    }

    // Send the result back to the main thread
    parentPort.postMessage(sum);
    ```
    **thread-workers-server.js**
    ```
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
    ```
    Here in workers page, we are dividing that task into 4 parts and 4 parts will be summed up in the last by: 
    ```
    const data = threadResult.reduce((acc, val) => acc + val, 0)
    ```