import { getUserList, saveToDb, update, checkUserExists, checkProjectExists } from "./db";
export class Todo {
    title;
    desc;
    dueDate;
    priority;
    status;
    notes;
    constructor(title, desc, dueDate, priority, status, notes) {
        this.title = title;
        this.desc = desc;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
        this.notes = notes
    }

    getTodo() {
        return {
            title: this.title,
            desc: this.desc,
            dueDate: this.dueDate,
            priority: this.priority,
            status: this.status,
            notes: this.notes
        }
    }
    addNewTodo(name, project) {
        let userList = getUserList();

        if (userList.length === 0 || !checkUserExists(name)) {
            console.error("User does not exist. Abort adding new Todo")
        }
        outer: for (let i = 0; i < userList.length; i++) {
            let userName = userList[i]["userName"];
            if (userName === name) {
                let projectList = userList[i]["projects"];

                inner: for (let j = 0; j < projectList.length; j++) {
                    let projectName = projectList[j]["title"]

                    if (projectName === project) {
                        let todoList = userList[i]["projects"][j]["todos"];
                        todoList.push(this.getTodo());
                        userList[i]["projects"][j]["todos"] = todoList;
                        break inner;
                    }
                }
                break outer;
            }
        }
        saveToDb({ users: JSON.stringify(userList) })
    }

    updateTodo(key, value, name, projectTitle, todoTitle) {
        if (!todoTitle) {
            console.error(`!todoTitle is ${!todoTitle}`)
            return;
        }
        let checkPoint = checkProjectExists(name, projectTitle)
        console.log(`Checkpoint is ${checkPoint}`)
        if (checkPoint) {
            let oldValue = update(key, value, name, projectTitle, todoTitle);
            console.log(`Old value of todo with key ${key} is ${oldValue} and replaced with ${value}`);
        }
        else
            console.error("User does not exist. Abort updating todo.")
    }
}