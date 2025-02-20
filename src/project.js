import { saveToDb, getUserList, update, checkUserExists } from "./db";

export class Project {
    title;
    dueDate;
    status;
    desc;
    todos;
    constructor(title, desc, dueDate, status) {
        this.title = title;
        this.desc = desc;
        this.dueDate = dueDate;
        this.status = status;
        this.todos = []
    }

    getProject() {
        return {
            title: this.title,
            desc: this.desc,
            dueDate: this.dueDate,
            status: this.status,
            todos: []
        }
    }

    addNewProject(name) {
        let userList = getUserList();

        if (userList.length === 0 || !checkUserExists(name)) {
            console.error("User does not exist. Abort creating new project")
        }

        outer: for (let i = 0; i < userList.length; i++) {
            let userName = userList[i]["userName"];
            if (userName === name) {
                let projectList = userList[i]["projects"];
                projectList.push(this.getProject())
                userList[i]["projects"] = projectList;
                break outer;
            }
        }
        saveToDb({ users: JSON.stringify(userList) })
    }

    updateProject(key, value, name, projectTitle) {
        if (!projectTitle)
            return
        if (checkUserExists(name)) {
            let oldValue = update(key, value, name, projectTitle);
            console.log(`Old value of project with key ${key} is ${oldValue} and replaced with ${value}`);
        }
        else
            console.error("User doesn not exist. Abort updating project")
    }
}
