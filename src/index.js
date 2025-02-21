import "./css_reset.css";
import "./styles.css";
import { saveToDb } from "./db.js"
import { Project } from "./project.js";
import { Todo } from "./todo.js";
import { User } from "./user.js"
import { Session } from "./ui.js";



let temp = [
    {
        userName: "0",
        projects: [
            {
                title: "project1",
                description: "desc",
                dueDate: "09",
                status: false,
                todos: [
                    {
                        title: "title",
                        description: "description",
                        dueDate: "dueDate",
                        priority: "priority",
                        notes: "notes"
                    }
                ]
            }
        ]
    }, {
        userName: "K",
        projects: [
            {
                title: "project1",
                description: "description",
                dueDate: "dueDate",
                status: true,
                todos: [
                    {
                        title: "title",
                        description: "description",
                        dueDate: "dueDate,",
                        priority: "priority",
                        notes: "notes"
                    }
                ]
            }
        ]
    }
]




function test(clear = false) {
    if (clear) {
        localStorage.clear()
        // const body = document.querySelector("body");
        // body.textContent = "";
        return
    }
    localStorage.clear()
    saveToDb({
        users: JSON.stringify(temp)
    })

    let user1 = new User("M");
    let project1 = new Project(
        "project1",
        "test project",
        "Monday",
        "INC"
    )
    let todo1 = new Todo(
        "todo1",
        "test todo",
        "02-20-2025",
        2,
        "INC",
        "Good Luck"
    )
    user1.addNewUserDb();
    user1.addNewProject(project1.getProject());
    user1.addNewTodo(project1.getProject()["title"], todo1.getTodo());
    
    user1.updateTodo("priority",3,"project1",todo1.getTodo()["title"]);
    user1.updateProject("desc","test project 2",project1.getProject()["title"]);
    
    user1.updateUser("userName","N","M");
    
    let session1 = new Session();
    session1.getCurrentUser("N");
    session1.renderDOM();
    let userList = JSON.parse(localStorage.getItem("users"));
    console.log(userList)
}
test();
// let userList = JSON.parse(localStorage.getItem("users"));
// console.log(userList)

