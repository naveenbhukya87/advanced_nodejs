Node JS Internal working:

- NodeJS is built on 2 things:
  - V8 Engine: Built on C++ to run Javascript
  - LibUV: a library to implement **Event Loop** and **Thread Pool**
- Code execution steps:
  - When running **node index.js**:
    - node creates **Node Process** which contains:
    - **Main Thread**: which do the following:
      - Initialize the project
      - Execution of top level code (Which are not in functions)
      - Execute require("module_name") code
      - Event callback register
      - Starts event loop
    - **Thread pool**: for CPU intensive tasks, we use threads but not main thread and CPU intensive tasks include: - fs - Crypto related tasks - compression - database related
      -- Event loop offloads CPU intensive tasks to threads.
      -- By default there are 4 threads and they can go upto 1024
      -- The worker pool size in NodeJS is changed from 128 to 1024 in V10.5.0. Prior to this version, the default worker pool size was 128. And 1024 can be increased by setting **UV_THREADPOOL_SIZE** environmental variable.
    - In Event loop order of execution is like:
      - Expired Timer callbacks (SetTimeout, SetInterval)
      - IO pooling like fs
      - SetImmediate Callbacks - CBS
      - Close callbacks - Socket, Server close related
      - Checks Pending tasks
      - if No pending tasks: EXIT
      - Else repeat the Event loop

    ```
        const fs = require('fs);
        SetTimeout(() => {
            console.log("Logged from SetTimeout")
        }, 0);
        console.log("Logged from console")

        -- Here:
            --> console.log("Logged from console") is top level code and it executes first and on main thread.
            --> SetTimeout runs on event loop and executes later.
    ```

    ```
        const fs = require('fs);
        SetTimeout(() => {
            console.log("Logged from SetTimeout")
        }, 0);
        setImmediate(() => {
            console.log('immediate');
        });
        console.log("Logged from console")

        -- Here:
            --> console.log("Logged from console") is top level code and it executes first and on main thread.
            --> SetTimeout runs on event loop and executes later.
            --> setImmediate executes later
    ```
    ```
        SetTimeout(() => {
            console.log("Logged from SetTimeout")
        }, 0);
        setImmediate(() => {
            console.log('immediate');
        });
    ```

    - Here in the absence of console.log, it gives output differently.
    - If we run the following script which is not within an I/O cycle (i.e. the main module), the order in which the two timers are executed is non-deterministic, as it is bound by the performance of the process.
    - However, if you move the two calls within an I/O cycle, the immediate callback is always executed first:
    - The main advantage to using setImmediate() over setTimeout() is setImmediate() will always be executed before any timers if scheduled within an I/O cycle, independently of how many timers are present.
        
        ```
            const fs = require('node:fs');

            fs.readFile(__filename, () => {
                setTimeout(() => {
                    console.log('timeout');
                }, 0);
                setImmediate(() => {
                    console.log('immediate');
                });
            });
        ```
- Example:
    ```
    const fs = require('fs')
    const crypto = require('crypto')
    setTimeout(() => console.log("Set Timeout: 1"), 0);

    setImmediate(() => console.log("Set Immediate: 1"))
    const start = Date.now()

    fs.readFile("./data.txt", "utf-8", () => {
        console.log("Clg from IO");
        setTimeout(() => console.log("Set Timeout: 2"), 0);
        setTimeout(() => console.log("Set Timeout: 3"), 5000);
        setImmediate(() => console.log("Set Immediate: 1"))

        crypto.pbkdf2("password1", "salt1", 100000, 1024, "sha512", () => {
            console.log(Date.now() - start, "Password1 is done")
        })
        crypto.pbkdf2("password2", "salt1", 100000, 1024, "sha512", () => {
            console.log(Date.now() - start, "Password2 is done")
        })
        crypto.pbkdf2("password3", "salt1", 100000, 1024, "sha512", () => {
            console.log(Date.now() - start, "Password3 is done")
        })
        crypto.pbkdf2("password4", "salt1", 100000, 1024, "sha512", () => {
            console.log(Date.now() - start, "Password4 is done")
        })
        crypto.pbkdf2("password5", "salt1", 100000, 1024, "sha512", () => {
            console.log(Date.now() - start, "Password5 is done")
        })
        crypto.pbkdf2("password6", "salt1", 100000, 1024, "sha512", () => {
            console.log(Date.now() - start, "Password6 is done")
        })
        crypto.pbkdf2("password7", "salt1", 100000, 1024, "sha512", () => {
            console.log(Date.now() - start, "Password7 is done")
        })
    })

    console.log("Clg from bottom")

    //-------------------[OUTPUT STARTS]-------------------//
    Clg from bottom
    Set Timeout: 1
    Set Immediate: 1
    Clg from IO
    Set Immediate: 1
    Set Timeout: 2
    1400 Password1 is done
    1426 Password3 is done
    1444 Password4 is done
    1519 Password2 is done
    2720 Password5 is done
    2830 Password7 is done
    2857 Password6 is done
    Set Timeout: 3
    //-------------------[OUTPUT END]-------------------//

    //-------------------[Explanation STARTS]-------------------//
    1. Top line code: Clg from bottom
    2. Expired timeout: Set Timeout: 1
    //------Still file is reading-------//
    3. setImmediate: Set Immediate: 1
    4. Entered IO and top level code: Clg from IO
    5. Next priority after IO is setImmediate and thus it logged else setTimeout has to get executed as per event loop: Set Immediate: 1
    6. Expired timeout: Set Timeout: 2
    7. CPU intensive op and run on thread num: 
        1 -> 1400 Password1 is done
        2 -> 1426 Password3 is done
        3 ->1444 Password4 is done
        4 -> 1519 Password2 is done
        1 -> 2720 Password5 is done
        2 -> 2830 Password7 is done
        3 -> 2857 Password6 is done
    8. Timeout expired: Set Timeout: 3
    //-------------------[Explanation END]-------------------//
    ```
    
- [reference](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
