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