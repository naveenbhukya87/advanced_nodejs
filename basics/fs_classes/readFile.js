const fs = require('fs');

const data = fs.readFileSync("./data.txt", "utf-8")
// console.log(data)

fs.writeFileSync("./data.txt", data + "\nCreated at " + new Date().toLocaleDateString() )
console.log("Done")
