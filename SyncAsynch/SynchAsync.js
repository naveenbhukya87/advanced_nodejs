const fs = require('fs');
const Synch = () => {
    const data = fs.readFileSync("../basics/fs_classes/data.txt", "utf-8")
    console.log(data)
    console.log("================================")
    console.log("Done")
}
const Asynch = () => {
    //No need of Synch
    fs.readFile("../basics/fs_classes/data.txt", "utf-8", (err, data) => {
        console.log(data)
    })
    console.log("================================")
    console.log("Done")
}

Synch()
Asynch()

