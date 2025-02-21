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
            description: this.desc,
            dueDate: this.dueDate,
            priority: this.priority,
            status: this.status,
            notes: this.notes
        }
    }
}