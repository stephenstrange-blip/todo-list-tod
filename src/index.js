import "./css_reset.css";
import "./styles.css";
import { saveToDb } from "./db.js"
import { Project } from "./project.js";
import { Todo } from "./todo.js";
import { User } from "./user.js"
import { Session } from "./ui.js";

let defaultUser = [
    {
        userName: "User",
        projects: [
            {
                title: "project1",
                description: "desc",
                dueDate: "dueDate",
                status: false,
                todos: [
                    {
                        title: "title",
                        description: "description",
                        dueDate: "dueDate",
                        priority: "priority",
                    }
                ]
            }
        ]
    }
]




function main() {
    localStorage.clear()
    saveToDb({
        users: JSON.stringify(defaultUser)
    })

    let user1 = new User("M");
    let project1 = new Project(
        "project1",
        "test project",
        "Monday",
        "INC"
    )
    let project2 = new Project(
        "project2",
        "test project 002",
        "Tomorrow",
        "INC"
    )
    let todo1 = new Todo(
        "todo1",
        "test todo",
        "02-20-2025",
        2,
        "INC",
    )
    let todo2 = new Todo(
        "todo2",
        "test todo",
        "02-20-2025",
        2,
        "INC",
    )
    let todo3 = new Todo(
        "todo3",
        "test todo3",
        "02-20-2025",
        2,
        "INC",
    )
    user1.addNewUserDb();
    user1.addNewProject(project1.getProject());
    user1.addNewTodo(project1.getProject()["title"], todo1.getTodo());
    user1.addNewTodo(project1.getProject()["title"],todo2.getTodo())
    user1.addNewProject(project2.getProject());
    user1.addNewTodo(project2.getProject()["title"], todo1.getTodo() )
    user1.updateTodo("priority",3,"project1",todo1.getTodo()["title"]);
    user1.updateProject("desc","test project 2",project1.getProject()["title"]);
    user1.addNewTodo(project1.getProject()["title"], todo3.getTodo());
    user1.updateUser("userName","N","M");
    
    let session = new Session();
    session.getUserInstance(user1);
    session.getCurrentUser("N");
    session.renderDOM();
}
main();
