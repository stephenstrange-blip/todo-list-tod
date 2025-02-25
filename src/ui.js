import { getUserList, getUserIndex, getProjectIndex, checkUserExists, getTodoIndex } from "./db";
import expandIcon from "./assets/plus.svg"
import removeIcon from "./assets/x-square.svg";
import editIcon from "./assets/edit.svg";
import previousIcon from "./assets/go-previous-svgrepo-com.svg"

export class Session {
    #currentUser;
    #userClass;

    getUserInstance(userClass) {
        this.#userClass = userClass
    }
    getCurrentUser(name) {
        this.name = name;
        console.log(this.name)
        let userList = getUserList();
        if (checkUserExists(this.name)) {
            let userIndex = getUserIndex(this.name);
            this.#currentUser = userList[userIndex];
        } else if (this.#userClass) {
            this.#userClass.name = "User";
            let userIndex = getUserIndex("User");
            this.#currentUser = userList[userIndex];
        }
    }

    renderDOM() {
        const fragment = new DocumentFragment();
        const body = document.querySelector("body");
        const bodyContainer = document.createElement("div");
        bodyContainer.className = "body-container";

        const sideBar = this.renderSidebar();
        const header = this.renderHeader();
        const content = this.renderContent();

        bodyContainer.append(sideBar, header, content);
        fragment.append(bodyContainer);
        body.append(fragment);
        this.expand();
        this.add();
    };

    renderContent(refresh = false) {
        let content;
        let projectList = this.#currentUser["projects"];
        if (!refresh) {
            content = document.createElement("div");
            content.classList.add("content", "project-view")
        }
        else {
            content = document.querySelector(".content")
            content.textContent = "";
            this.switchView();
        }

        for (let project of projectList) {
            let temp = this.renderProject(project);
            content.append(temp);
        }

        return content;
    }
    renderProject(project) {
        console.log(project)

        const projectCard = document.createElement("div");
        const projectTitle = document.createElement("div");
        const projectDesc = document.createElement("div");
        const projectDue = document.createElement("div");
        const projectStatus = document.createElement("div");
        const todoPeek = document.createElement("div");
        const expand = document.createElement("div");

        const expandIconHolder = document.createElement("img");
        const dueHolder = document.createElement("p");

        const todoList = project["todos"];
        const todoTitles = todoList === undefined ? "" : todoList.map(todo => todo["title"])

        projectCard.dataset.identifier = project["title"];
        projectTitle.dataset.identifier = project["title"];
        projectDesc.dataset.identifier = project["title"];;
        projectDue.dataset.identifier = project["title"];
        projectStatus.dataset.identifier = project["title"];;
        todoPeek.dataset.identifier = project["title"];;
        expand.dataset.identifier = project["title"];;

        projectCard.className = "project";
        projectTitle.className = "title";
        projectDesc.className = "desc";
        projectDue.className = "dueDate";
        projectStatus.className = "status";
        todoPeek.className = "todo-peek";
        expand.className = "expand";

        projectTitle.textContent = project["title"];
        projectDesc.textContent = project["description"];
        projectDue.textContent = "Due on:"
        dueHolder.textContent = project["dueDate"];
        projectStatus.textContent = project["status"] === true ? "Complete" : "Incomplete"
        todoPeek.textContent = todoTitles === "" ? "" : todoTitles.join(`:\n`);
        expandIconHolder.src = expandIcon;

        projectDue.append(dueHolder);
        expand.append(expandIconHolder);
        projectCard.append(projectTitle, projectDesc, projectDue, projectStatus, todoPeek, expand);

        return projectCard;
    }

    renderHeader() {
        const header = document.createElement("div");
        const headerTitle = document.createElement("div");

        const classLessDiv = document.createElement("div");
        const pWordOfDay = document.createElement("p");
        const randomWord = document.createElement("p");

        header.className = "header"
        headerTitle.className = "header-title";
        randomWord.className = "random-word";

        headerTitle.textContent = "Things to do";
        pWordOfDay.textContent = "Word of the day:";
        randomWord.textContent = "Contingency";

        classLessDiv.append(pWordOfDay, randomWord);
        header.append(headerTitle, classLessDiv);

        return header;
    }

    renderSidebar(refresh = false) {
        if (refresh) {
            const oldUserName = document.querySelector(".user-name");
            oldUserName.textContent = this.#currentUser["userName"];
            return
        }

        const sideBar = document.createElement("div");
        const userDiv = document.createElement("div");
        const userIcon = document.createElement("div");
        const userName = document.createElement("div");

        const actions = document.createElement("div");
        const create = document.createElement("div");
        const setting = document.createElement("div");
        const about = document.createElement("div");
        const email = document.createElement("div");

        sideBar.className = "sideBar";
        userDiv.classList = "user";
        userIcon.className = "user-icon";
        userName.className = "user-name";
        actions.className = "sidebar-actions";
        userName.textContent = this.#currentUser["userName"];

        create.classList.add("action", "create");
        setting.classList.add("action", "setting");
        about.classList.add("action", "about");
        email.classList.add("action", "email");

        create.textContent = "Create";
        setting.textContent = "Setting";
        about.textContent = "About";
        email.textContent = "Email";

        let tempActions = [create, setting, about, email]
        for (let tempAction of tempActions) {
            let anchorTag = document.createElement("a");
            anchorTag.append(tempAction);
            actions.append(anchorTag);
        }
        userDiv.append(userIcon, userName);
        sideBar.append(userDiv, actions);

        return sideBar;
    }

    switchView() {
        const content = document.querySelector(".content");
        const contentView = content.classList;
        const currentView = contentView[1]

        console.log(`ContentView is ${contentView}`)
        console.log(!contentView, contentView.length === 3);

        if (!contentView || contentView.length > 2)
            return

        console.log(contentView[1])
        content.classList.remove(contentView[1]);
        console.log(content.classList)
        content.classList.add(currentView === "project-view" ? "todo-view" : "project-view")
        console.log(content.classList)
    }

    expandProject(e, refresh = false, projectIdentifier = "") {
        let projectTitle = e.currentTarget === undefined ? projectIdentifier : e.currentTarget.dataset.identifier;
        const projectIndex = getProjectIndex(this.#currentUser["userName"], projectTitle)[1];
        const todoList = this.#currentUser["projects"][projectIndex]["todos"];
        console.log(todoList)
        const content = document.querySelector(".content");
        const todoContainer = document.createElement("div");
        const projectDesc = document.createElement("div");
        const title = document.createElement("div");
        const ul = document.createElement("ul");

        const projectActions = document.createElement("div");
        const prevBtn = document.createElement("button");
        const prevImg = document.createElement("img");
        const addBtn = document.createElement("button");
        const addImg = document.createElement("img");

        if (refresh) {
            console.log(`content is being refreshed`)
            content.textContent = "";
        }
        else this.switchView();

        for (let todo of todoList) {
            const li = document.createElement("li");

            const todoTitle = document.createElement("div");
            const remove = document.createElement("div");
            const edit = document.createElement("div");
            const removeImg = document.createElement("img");
            const editImg = document.createElement("img");

            li.dataset.identifier = todo["title"];
            li.dataset.identifier2 = projectTitle;
            todoTitle.className = "todo-title";
            remove.className = "remove";
            edit.className = "edit";

            todoTitle.textContent = todo["title"];

            Object.assign(removeImg, {
                src: removeIcon,
                alt: "R"
            })
            Object.assign(editImg, {
                src: editIcon,
                alt: "E"
            })

            remove.append(removeImg);
            edit.append(editImg);
            li.append(todoTitle, edit, remove,);
            ul.append(li);
        }

        title.className = "project-title";
        projectActions.className = "return";
        projectDesc.className = "project-description";
        todoContainer.className = "todo-container";

        addBtn.type = "button";
        prevBtn.type = "button";

        title.textContent = this.#currentUser["projects"][projectIndex]["title"];
        projectDesc.textContent = this.#currentUser["projects"][projectIndex]["description"];
        prevImg.src = previousIcon;
        addImg.src = expandIcon;

        Object.assign(prevBtn, {
            width: 6,
            height: 4,
            id: "previous"
        })
        Object.assign(addBtn, {
            width: 6,
            height: 4,
            id: "add"
        })

        prevBtn.append(prevImg);
        addBtn.append(addImg);
        projectActions.append(addBtn, prevBtn);
        title.append(projectActions)

        todoContainer.append(ul);
        content.textContent = "";
        content.append(title, projectDesc, todoContainer);
        this.hover();
    }

    hover() {
        const titleParents = document.querySelectorAll(".todo-container > ul > li");
        console.log(titleParents.length);

        if (!titleParents)
            return

        function show(e, mouseOut) {
            e.stopPropagation();
            let identifier = e.currentTarget.dataset.identifier;
            let [edit, remove] = document.querySelectorAll(`li[data-identifier=${identifier}] > .todo-title ~ div`);
            if (!mouseOut) {
                remove.style.opacity = .6;
                edit.style.opacity = .6;

            } else {
                remove.style.opacity = 0;
                edit.style.opacity = 0;
            }
        }
        for (let liElement of titleParents) {
            let [title, edit, remove] = liElement.childNodes;

            liElement.addEventListener("mouseover", (e) => { show(e, false) });
            liElement.addEventListener("mouseout", (e) => { show(e, true) });
            // edit.addEventListener("click", (e) => { this.expandTodo(e, false, title) })
            remove.addEventListener("click", () => { this.createConfirmDialog(false, true) })
        }

        const returnBtns = document.querySelectorAll("#previous, #add");
        console.log(returnBtns)
        if (!returnBtns)
            return

        returnBtns.forEach(button => {
            button.addEventListener("mousedown", (e) => {
                e.stopPropagation()
                let target = e.currentTarget
                target.style["background-color"] = "rgba(0,0,0, .7)";
            })
        })
        returnBtns.forEach(button => {
            button.addEventListener("mouseup", (e) => {
                e.stopPropagation()
                let target = e.currentTarget
                target.style["background-color"] = "transparent";
            })
        })

    }

    expand() {
        const expandButtons = document.querySelectorAll(".expand");
        console.log(expandButtons)
        if (!expandButtons)
            return;

        for (let btn of expandButtons) {
            btn.addEventListener("click", (e) => {
                this.expandProject(e);
                this.previous();
                this.add();
            })
        }
    }

    previous() {
        const previousBtn = document.querySelector("#previous");
        if (!previousBtn)
            return
        previousBtn.addEventListener("click", () => {
            let content = this.renderContent(true);
            let bodyContainer = document.querySelector(".body-container");
            bodyContainer.append(content);
            this.expand()
        })
    }
    add() {
        const addBtn = document.querySelector("#add");
        const create = document.querySelector(".sidebar-actions > a:first-of-type");
        // console.log(create, `this is create`, addBtn, `this is add`)
        const initiateDialog = (event, newTodo = false) => {
            event.preventDefault();
            event.stopPropagation();
            this.removeDialog();
            this.createDialog(newTodo);
            this.createConfirmDialog(newTodo);
            this.handleDialog(newTodo);
            const dialog = document.querySelector("dialog:not([id=confirm-dialog");
            dialog.showModal();
        }
        if (addBtn) {
            console.log("adding event listeners to add new todos")
            addBtn.addEventListener("click", (e) => {
                initiateDialog(e, true);
                const content = document.querySelector(".content");
                content.classList.add("dialog-open");
            })
        }
        if (create) {
            console.log("adding event listeners to create new projects")
            create.addEventListener("click", (e) => {
                initiateDialog(e);
                const content = document.querySelector(".content");
                content.classList.add("dialog-open");
            })
        }

    }
    removeDialog() {
        const content = document.querySelector(".content");
        const dialog = document.querySelectorAll("dialog:not([id=confirm-dialog");
        const confirmDialog = document.querySelectorAll("dialog#confirm-dialog");
        console.log(dialog, confirmDialog)

        if (confirmDialog && confirmDialog.length > 0) {
            for (let i = 0; i < confirmDialog.length; i++) {
                content.removeChild(confirmDialog[i])
            }
            console.log("Confirm Dialogs removed. Ready to add new Dialogs");
        }

        if (dialog && dialog.length > 0) {
            for (let i = 0; i < confirmDialog.length; i++) {
                content.removeChild(dialog[i])
            }
            console.log("Dialogs removed. Ready to add new Dialogs");
        }
        console.log(content.childNodes);
        content.classList.remove("dialog-open");
        console.log(content.childNodes);
    }

    handleDialog(newTodo = false) {
        const dialog = document.querySelector("dialog");
        const submitBtn = document.getElementById("submit");
        const cancel = document.getElementById("cancel");
        const confirmDialog = document.getElementById("confirm-dialog");
        const confirmBtn = document.getElementById("confirm-option");
        const confirmCancel = document.getElementById("cancel-confirm");

        const inputs = dialog.querySelectorAll("dialog:not([id=confirm-dialog]) > form > p > input");
        const returnValue = {};

        dialog.addEventListener("close", () => {
            this.removeDialog();
        })
        cancel.addEventListener("click", () => {
            dialog.close();
            this.removeDialog();
        })
        confirmCancel.addEventListener("click", (e) => {
            confirmDialog.close();
        })

        submitBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            confirmDialog.showModal();
        })
        confirmBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            inputs.forEach((input) => {
                if (input.name == "priority")
                    returnValue[input.name] = parseInt(input.value)
                returnValue[input.name] = input.value;
            })
            returnValue["status"] = false;

            let userName = this.#currentUser["userName"];
            if (newTodo) {
                this.#userClass.addNewTodo(dialog.dataset.identifier, returnValue);
                this.getCurrentUser(userName);
                this.expandProject("", true, dialog.dataset.identifier);
                this.previous();
                this.add();
            }
            else {
                console.log("adding new project...")
                returnValue["todos"] = [];
                this.#userClass.addNewProject(returnValue);
                this.getCurrentUser(userName);
                this.renderContent(true);
                this.expand();
            }
            confirmDialog.close();
            dialog.close();
        })
    }

    createConfirmDialog(newTodo = false, removeTodo = false) {
        const content = document.querySelector(".content");
        const dialog = document.createElement("dialog");
        const form = document.createElement("form");
        const confirmMessage = document.createElement("p");
        const confirmOption = document.createElement("button");
        const cancelOption = document.createElement("button");

        dialog.id = "confirm-dialog";
        confirmOption.id = "confirm-option"
        confirmOption.textContent = "Confirm";
        cancelOption.id = "cancel-confirm";
        cancelOption.textContent = "Cancel";

        if (newTodo)
            confirmMessage.textContent = "Confirm adding new todo?";
        else if (removeTodo)
            confirmMessage.textContent = "Confirm removing todo?"
        else
            confirmMessage.textContent = "Confirm creating new project?"

        form.append(confirmMessage, confirmOption, cancelOption);
        dialog.append(form);
        content.append(dialog);

    }

    createDialog(newTodo = false) {
        let identifier;
        if (newTodo)
            identifier = document.querySelector(".project-title").textContent;
        else
            identifier = this.#currentUser["userName"];

        console.log(`Identifier is ${identifier}`);
        const content = document.querySelector(".content");
        const dialog = document.createElement("dialog");
        const form = document.createElement("form");

        const cancel = document.createElement("button");
        const submit = document.createElement("button");

        const titleInput = document.createElement("input");
        const descriptionInput = document.createElement("input");
        const dueDateInput = document.createElement("input");

        const titleLabel = document.createElement("label");
        const descriptionLabel = document.createElement("label");
        const dueDateLabel = document.createElement("label");

        const pTitle = document.createElement("p");
        const pDesc = document.createElement("p");
        const pDueDate = document.createElement("p");

        Object.assign(titleInput, {
            id: "title",
            name: "title",
            type: "text",
            required: "true",
            placeholder: "Do something",
            maxLength: 25,
            minLength: 1,
        })
        Object.assign(descriptionInput, {
            id: "desc",
            name: "description",
            type: "text",
            required: "true",
            placeholder: newTodo === true ? "Do something with someone" : "What is your project's ultimate goal?",
            maxLength: 50,
            minLength: 1,
        })
        Object.assign(dueDateInput, {
            id: "dueDate",
            name: "dueDate",
            required: "true",
            placeholder: "XX-XX-XXXX",
            maxLength: 25,
            minLength: 1,
        })


        Object.assign(cancel, {
            id: "cancel",
            formmethod: "dialog",
            textContent: "Cancel"
        })
        Object.assign(submit, {
            id: "submit",
            type: "submit",
            textContent: "Submit"
        })

        Object.assign(titleLabel, {
            for: "title",
            textContent: "Title"
        })
        Object.assign(descriptionLabel, {
            for: "desc",
            textContent: newTodo === true ? "Describe your Todo" : "Describe your Project"
        })
        Object.assign(dueDateLabel, {
            for: "dueDate",
            textContent: newTodo === true ? "When is it due?" : "When do you plan to finish all TODOs?"
        })


        titleLabel.setAttribute("for", "title");
        descriptionLabel.setAttribute("for", "desc");
        dueDateLabel.setAttribute("for", "dueDate");
        dialog.dataset.identifier = identifier;

        pTitle.append(titleInput, titleLabel);
        pDesc.append(descriptionInput, descriptionLabel);
        pDueDate.append(dueDateInput, dueDateLabel);

        form.append(pTitle, pDesc, pDueDate, cancel, submit);

        if (newTodo) {
            const priorityInput = document.createElement("input");
            const priorityLabel = document.createElement("label");
            const pPriority = document.createElement("p");
            Object.assign(priorityInput, {
                id: "priority",
                name: "priority",
                type: "number",
                required: "true",
                placeholder: "1",
                maxLength: 1,
                minLength: 1,
            })
            Object.assign(priorityLabel, {
                for: "priority",
                textContent: "0 - most urgent, 9 - optional"
            })
            priorityLabel.setAttribute("for", "priority");
            pPriority.append(priorityInput, priorityLabel);
            form.insertBefore(pPriority, pDueDate);
        }
        dialog.append(form);
        content.append(dialog);
    }
    expandTodo(e, refresh = false, projectIdentifier = "") {
        content.classList.add("todo-edit");
        const project = e.currentTarget === undefined ? projectIdentifier : e.currentTarget.dataset.identifier2;
        const todoIdentifier = e.currentTarget === undefined ? projectIdentifier : e.currentTarget.dataset.identifier;
        const [projectIndex, todoIndex] = getTodoIndex(this.#currentUser["userName"], project, todoIdentifier).slice(1);
        const todo = this.#currentUser["projects"][projectIndex]["todos"][todoIndex];
        console.log(todo);

        const content = document.querySelector(".content");
        const todoTitle = document.createElement("div");
        const todoPriority = document.createElement("div");
        const todoContainer = document.createElement("div");
        const todoDesc = document.createElement("div");
        const todoDue = document.createElement("div");
        
        const prevBtn = document.createElement("button");
        const prevImg = document.createElement("img");

        const switchLabel = document.createElement("label");
        const status = document.createElement("input");
        const slider = document.createElement("span");

        if (refresh) {
            console.log(`content is being refreshed`)
            content.textContent = "";
        }
        else this.switchView();

        const editAction = document.createElement("div");
        const editImg = document.createElement("img");

        todoContainer.className = "todo-container";
        todoTitle.className = "todo-title";
        todoPriority.className = "priority";
        todoDesc.className = "todo-description";
        
        todoTitle.textContent = todo["title"];
        todoPriority.textContent = todo["priority"];
        todoDesc.textContent = todo["description"];

        
    }
}