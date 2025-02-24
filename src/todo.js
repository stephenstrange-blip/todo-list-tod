import { getUserList, saveToDb, update, checkUserExists, checkProjectExists } from "./db";
export class Todo {
    title;
    desc;
    dueDate;
    priority;
    status;
    notes;
    constructor(title, desc, dueDate, priority, status) {
        this.title = title;
        this.desc = desc;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
    }

    getTodo() {
        return {
            title: this.title,
            description: this.desc,
            dueDate: this.dueDate,
            priority: this.priority,
            status: this.status,
        }
    }
}