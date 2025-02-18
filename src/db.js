export function saveToDb(object) {
    if (typeof (object) !== "object") {
        console.error(`Received argument ${object} is not of an object type!`)
        return
    }

    // [key, value]
    let keyValue = Object.entries(object)[0];
    let dbValue = localStorage.getItem(keyValue[0]);

    if (dbValue) {
        // existing value is an array
        let dbList = JSON.parse(dbValue);
        // each item in the existing value is an object
        let newData = { [keyValue[1]]: {} }
        dbList.push(newData);

        localStorage.setItem(keyValue[0], JSON.stringify(dbList));
        console.log("Saved to DB!");
    }
    else {
        // if the key doesn't exist yet in localStorage, nor will the value
        let newList = [{ [keyValue[1]]: {} }]
        localStorage.setItem(keyValue[0], JSON.stringify(newList))
        console.log("Key not found. Creating a new key value pair")
    }

}
