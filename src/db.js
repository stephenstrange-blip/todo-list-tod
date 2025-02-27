function saveToDb(object) {
    if (typeof (object) !== "object") {
        console.error(`Received argument ${object} is not of an object type!`)
        return
    }
    try {
        let key = Object.keys(object)[0]
        let value = Object.values(object)[0]
        localStorage.setItem(key, typeof (value) === 'string' ? value : JSON.stringify(value))
    }
    catch (err) {
        console.error(err);
    }

}

function checkUserExists(name) {
    let userList = getUserList();
    if (!userList) {
        console.error(`Cannot check for existing users. List is undefined!`)
        return false
    }
    let userMatch = userList.filter(user => user["userName"] === name)
    if (userMatch.length !== 0) {
        console.log(`There is a user match`)
        return true
    }

    return false
}

function checkProjectExists(name, projectTitle) {
    let userList = getUserList();
    if (!userList || !checkUserExists(name)) {
        console.error(`Cannot check for existing users. List is undefined or User doesn't exist!`)
        return false
    }

    for (let i = 0; i < userList.length; i++) {
        let userName = userList[i]["userName"];
        if (name === userName) {
            let projectList = userList[i]["projects"];       
            let projectMatch = projectList.filter(project => project["title"] === projectTitle);
            if (projectMatch.length !== 0) {
                console.log(`There is a project match `, projectMatch)
                return true
            }
        }
    }
    console.log("Cannot find existing project")
    return false
}

function checkTodoExists(name, projectTitle, todoTitle) {
    let userList = getUserList();
    if (!userList) {
        console.error(`Cannot check for existing users. List is undefined`)
        return false
    }
    if (!checkProjectExists(name, projectTitle)) {
        console.error(`Cannot check for existing projects. Project does not exist yet!`)
        return false
    }
    for (let i = 0; i < userList.length; i++) {
        let userName = userList[i]["userName"];
        if (name === userName) {
            let projectList = userList[i]["projects"];
            for (let j = 0; j < projectList.length; j++) {
                let projectName = userList[i]["projects"][j]["title"];
                if (projectName === projectTitle) {
                    let todoList = userList[i]["projects"][j]["todos"];
                    let todoMatch = todoList.filter(todo => todo["title"] === todoTitle);
                    if (todoMatch.length !== 0) {
                        console.log(`There is a todo match`);
                        return true
                    }
                }
            }
        }
    }
    return false

}

function getUserList() {
    return JSON.parse(localStorage.getItem("users"));
}

function getUserIndex(name) {
    let userList = getUserList();

    if (!userList) {
        console.error("Users List from DB not found or undefined!")
        return
    }

    for (let i = 0; i < userList.length; i++) {
        let userName = userList[i]["userName"];
        if (name === userName)
            return i;
    }
    console.error("User not found!")
    return [0]
}

function getProjectIndex(name, projectTitle) {
    let userList = getUserList();

    if (!userList) {
        console.error("Users List from DB not found or undefined!")
        return
    }

    for (let i = 0; i < userList.length; i++) {
        let userName = userList[i]["userName"];
        if (name === userName) {
            let projectList = userList[i]["projects"];
            for (let j = 0; j < projectList.length; j++) {
                let projectName = userList[i]["projects"][j]["title"];
                if (projectTitle === projectName)
                    return [i, j]
            }
        }
    }
    console.error("User/Project not found!")
    return [0, 0]

}

function getTodoIndex(name, projectTitle, todoTitle) {
    let userList = getUserList();

    if (!userList) {
        console.error("Users List from DB not found or undefined!")
        return
    }
    for (let i = 0; i < userList.length; i++) {
        let userName = userList[i]["userName"];
        if (name === userName) {
            let projectList = userList[i]["projects"];
            for (let j = 0; j < projectList.length; j++) {
                let projectName = userList[i]["projects"][j]["title"];
                console.log(`${projectName} === ${projectTitle}: ${projectName === projectTitle}`);
                if (projectName === projectTitle) {
                    let todoList = userList[i]["projects"][j]["todos"];
                    for (let m = 0; m < todoList.length; m++) {
                        let todoName = userList[i]["projects"][j]["todos"][m]["title"];
                        if (todoTitle === todoName) {
                            return [i, j, m]
                        }
                    }
                }
            }
        }
    }
    console.error("User/Project/Todo not found!")
    return [0, 0, 0]
}

function update(key, value, name, projectTitle, todoTitle) {
    let userList = getUserList();
    if (userList.length === 0)
        return

    if (todoTitle && projectTitle) {
        console.log(`Retrieving todo index...`)
        let [user, project, todo] = getTodoIndex(name, projectTitle, todoTitle);
        let oldValue = userList[user]["projects"][project]["todos"][todo][key];
        userList[user]["projects"][project]["todos"][todo][key] = value;

        saveToDb({ users: userList });
        return oldValue;
    }
    if (!todoTitle && projectTitle) {
        console.log(`Retrieving project index...`)
        let [user, project] = getProjectIndex(name, projectTitle);
        let oldValue = userList[user]["projects"][project][key];
        userList[user]["projects"][project][key] = value;

        saveToDb({ users: JSON.stringify(userList) });
        return oldValue;
    }
    if (!todoTitle && !projectTitle) {
        console.log(`Retrieving user index...`)
        let index = getUserIndex(name);
        let oldValue = userList[index]["userName"];
        userList[index]["userName"] = value;

        saveToDb({ users: JSON.stringify(userList) });
        return oldValue;
    }
}

export { saveToDb, getUserList, checkUserExists, update, checkProjectExists, getUserIndex, getTodoIndex, getProjectIndex }



