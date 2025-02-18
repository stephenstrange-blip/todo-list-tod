class ToDo
    '-> title, description, dueDate, priority, status

class Project
    '-> array_of_todo, dueDate, status, description

class User
    '-> name

class Db
    '-> save();
modules: 
    '-> validateDate();

    '-> remove();
    '-> add();
    '-> checkStatus();
            '-> check if todo is complete
            '-> check if all todos in a project is complete or not
    '-> sort();
            '-> prioritySort
            '-> dueDateSort
                '-> sort the Todos within each project
                '-> sort the Projects within each User


DOM modules:
    '-> getInput() => for all properties of User and ToDo
 
todo = remove + add + checkStatus + save
project = remove + add + checkStatus + sort(todo-priority, todo-dueDate) + save
user = remove + add + save

{ users : [
    {
        user1 : {
            projects : [
                {
                    project1 : {
                        desc : "",
                        dueDate : "",
                        todos : [
                            {
                                todo1 : {
                                    title: "todo1",
                                    desc: "",
                                    dueDate: "",
                                    priority: "",
                                    status: ""
                                }
                            },
                            {
                                todo2 : {
                                    title: "todo2",
                                    desc: "",
                                    dueDate: "",
                                    priority: "",
                                    status: ""
                                }
                            }
                        ]
                    }
                },
                {
                    project2 : project1 : {
                        desc : "",
                        dueDate : "",
                        todos : [
                            {
                                todo1 : {
                                    title: "todo1",
                                    desc: "",
                                    dueDate: "",
                                    priority: "",
                                    status: ""
                                }
                            },
                            {
                                todo2 : {
                                    title: "todo2",
                                    desc: "",
                                    dueDate: "",
                                    priority: "",
                                    status: ""
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        user2 :
    }
]}