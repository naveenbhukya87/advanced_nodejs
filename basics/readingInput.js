const readLine = require('readline');
const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Please enter num1: ", (a) => {
    rl.question("Please enter num2: ", (b) => {
        console.log(`Sum of ${a} and ${b} is `, parseInt(a) + parseInt(b))
        rl.close()
    })
})

rl.on("close", ()=>{
    console.log("Interface is closed")
    process.exit(0)
})