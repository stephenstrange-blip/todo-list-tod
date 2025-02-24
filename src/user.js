import { saveToDb, getUserList, checkUserExists, update, checkProjectExists } from "./db";
export class User {
    name;
    constructor(name) {
        this.name = name
    }

    addNewUserDb() {
        let userList = getUserList();
        if (!userList) 
            return
        if (checkUserExists(this.name)) {
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
            this.name = value;
            console.log(`Old value of User with key ${key} is ${oldValue} and replaced with ${value}`)
        };
        
    }
    
    addNewProject(project) {
        let userList = getUserList();
        console.log(userList)
        if (userList.length === 0 || !checkUserExists(this.name)) {
            console.error("User does not exist. Abort creating new project")
        }

        outer: for (let i = 0; i < userList.length; i++) {
            let userName = userList[i]["userName"];
            if (userName === this.name) {
                let projectList = userList[i]["projects"];
                projectList.push(project)
                userList[i]["projects"] = projectList;
                break outer;
            }
        }
        saveToDb({ users: JSON.stringify(userList) })
    }

    updateProject(key, value, projectTitle) {
        if (!projectTitle)
            return
        if (checkUserExists(this.name)) {
            let oldValue = update(key, value, this.name, projectTitle);
            console.log(`Old value of project with key ${key} is ${oldValue} and replaced with ${value}`);
        }
        else
            console.error("User doesn not exist. Abort updating project")
    }

    addNewTodo(projectTitle, todo) {
        let userList = getUserList();
        console.log(userList, this.name)
        if (userList.length === 0 || !checkUserExists(this.name)) {
            console.error("User does not exist. Abort adding new Todo")
        }
        outer: for (let i = 0; i < userList.length; i++) {
            let userName = userList[i]["userName"];
            if (userName === this.name) {
                let projectList = userList[i]["projects"];

                inner: for (let j = 0; j < projectList.length; j++) {
                    let projectName = projectList[j]["title"]

                    if (projectName === projectTitle) {
                        let todoList = userList[i]["projects"][j]["todos"];
                        todoList.push(todo);
                        userList[i]["projects"][j]["todos"] = todoList;
                        break inner;
                    }
                }
                break outer;
            }
        }
        saveToDb({ users: JSON.stringify(userList) })
    }

    updateTodo(key, value, projectTitle, todoTitle) {
        if (!todoTitle) {
            console.error(`!todoTitle is ${!todoTitle}`)
            return;
        }
        let checkPoint = checkProjectExists(this.name, projectTitle)
        console.log(`Checkpoint is ${checkPoint}`)
        if (checkPoint) {
            let oldValue = update(key, value, this.name, projectTitle, todoTitle);
            console.log(`Old value of todo with key ${key} is ${oldValue} and replaced with ${value}`);
        }
        else
            console.error("User does not exist. Abort updating todo.")
    }



}