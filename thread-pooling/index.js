const http = require('http');

const bcrypt = require('bcrypt');
const saltRounds = 2;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
/*
command to hit many times: ab -n 1000 -c 100 "http://localhost:5000/" | grep -i Requests
for process.env.UV_THREADPOOL_SIZE = 
    1: Requests per second:    622.34 [#/sec] (mean)
    2: Requests per second:    1197.86 [#/sec] (mean)
    3: Requests per second:    1772.86 [#/sec] (mean)
    4: Requests per second:    2132.06 [#/sec] (mean)
    5: Requests per second:    2519.59 [#/sec] (mean)

*/

const server = http.createServer((req, res) => {
    bcrypt.hash(myPlaintextPassword, saltRounds).then(function (hash) {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        })
        res.write(hash)
        res.end();
    });
})
server.listen(5000, () => {
    console.log("Server is up and running on 5000")
})