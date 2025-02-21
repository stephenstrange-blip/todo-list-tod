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
            description: this.desc,
            dueDate: this.dueDate,
            status: this.status,
            todos: []
        }
    }
}
