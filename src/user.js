import { saveToDb, getUserList, checkUserExists, update } from "./db";
export class User {
    name;
    constructor(name) {
        this.name = name
    }

    addNewUserDb() {
        let userList = getUserList();
        if (checkUserExists(this.name) || !userList) {
            console.error(`checkUserExists = ${checkUserExists(this.name)} and userList = ${!userList}`);
            return
        }
        userList.push({
            userName: this.name,
            projects: []
        })
        saveToDb({ users: JSON.stringify(userList) });
    }

    updateUser(key, value, name) {
        if (!name)
            return
        if (checkUserExists(name)) { 
            let oldValue = update(key, value, name) 
            console.log(`Old value of User with key ${key} is ${oldValue} and replaced with ${value}`)
        };
    }


}