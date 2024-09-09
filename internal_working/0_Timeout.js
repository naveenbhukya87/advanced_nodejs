const function1 = () => {
    console.log("Clg from First line function1")
    setTimeout(() => {
        console.log("Clg from SetTimeout function1")
    }, 0);
    setImmediate(() => {
        console.log("Clg from setImmediate function1")
    });
    console.log("Clg from last line function1")
}

/*
Clg from First line
Clg from last line
Clg from SetTimeout
Clg from setImmediate
*/


const function2 = () => {
    setTimeout(() => {
        console.log("Clg from SetTimeout function2")
    }, 0);
    setImmediate(() => {
        console.log("Clg from setImmediate function2")
    });
}
const function3 = () => {
    setImmediate(() => {
        console.log("Clg from setImmediate function3")
    });
    setTimeout(() => {
        console.log("Clg from SetTimeout function3")
    },0);
}

/*
Clg from SetTimeout
Clg from setImmediate
*/

// function1()
function2()
// function3()

