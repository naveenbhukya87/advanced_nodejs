const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const log = `${new Date().toLocaleDateString()}:${new Date().toLocaleTimeString()}: Requested is made on ${url}\n`;
    //Here use non-synchronous fs.appendFile but not fs.appendFileSynch so that no load on threads
    fs.appendFile("log.txt", log, (err) => {
        if (err) console.log(err);
        switch (url) {
            case "/":
                res.end("request is made for " + url);
                break;
            case "/about":
                res.end("request is made for " + url);
                break;
            default:
                res.end("404 Not found");
        }
    })
})
server.listen(5000, () => {
    console.log("Server is up and running on 5000")
})