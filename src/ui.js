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
        const currentView = contentView[1];

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
        if (!titleParents)
            return

        function show(e, mouseOut) {
            e.stopPropagation();
            let [title, edit, remove] = e.currentTarget.childNodes;
            if (!mouseOut) {
                if (remove)
                    remove.style.opacity = .6;
                edit.style.opacity = .6;

            } else {
                if (remove)
                    remove.style.opacity = 0;
                edit.style.opacity = 0;
            }
        }
        for (let liElement of titleParents) {
            if (liElement.childNodes[0].className === "switch")
                return
            liElement.addEventListener("mouseover", (e) => { show(e, false) });
            liElement.addEventListener("mouseout", (e) => { show(e, true) });

            if (liElement.className === "") {
                let [title, edit, remove] = liElement.childNodes;
                edit.addEventListener("click", (e) => {
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    this.expandTodo(e, true, liElement.dataset);
                    this.hover();
                    this.previous(liElement)
                })
                remove.addEventListener("click", () => { this.createConfirmDialog(false, true) })
            } else {
                let edit = liElement.childNodes[1];
                edit.addEventListener("click", (e) => {
                    this.removeDialog();
                    this.createUpdateDialog(e);
                    this.createConfirmDialog(false, false, true);
                    this.handleUpdateDialog();
                    const updateDialog = document.querySelector(".update-dialog");
                    updateDialog.showModal();
                })
            }
        }

        const returnBtns = document.querySelectorAll("#previous, #add");
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

    createUpdateDialog(e) {
        const sibling = e.currentTarget.previousSibling;
        const key = sibling.className.split("-")[1]
        console.log(`Sibling:`, sibling, key)

        const content = document.querySelector(".content");
        const dialog = document.createElement("dialog");
        const form = document.createElement("form");
        const label = document.createElement("label");
        const input = document.createElement("input");
        const submit = document.createElement("button");
        const cancel = document.createElement("button");

        dialog.className = "update-dialog";
        submit.className = "update-submit";
        cancel.className = "update-cancel";

        label.for = "update-input";
        label.textContent = `New value for ${key.toUpperCase()}`;
        input.id = "update-input";
        input.dataset.key = key;
        input.required = true;
        input.name = "input";
        submit.type = "submit";
        submit.id = "submit-update";
        submit.textContent = "Submit";
        cancel.textContent = "Cancel";
        cancel.formmethod = "dialog";
        cancel.id = "cancel-update";

        form.append(label, input, submit, cancel);
        dialog.append(form);
        content.append(dialog);
    }

    handleUpdateDialog() {
        const confirmDialog = document.querySelector("#confirm-dialog");
        const updateDialog = document.querySelector(".update-dialog");
        const submitBtn = document.querySelector(".update-submit");
        const confirmBtn = document.querySelector("#confirm-option");
        const cancelBtn = document.querySelector(".update-cancel");
        const cancelConfirm = document.querySelector("#cancel-confirm");
        const input = document.querySelector("#update-input");
        const li = document.querySelector(".expand-todo");
        const [projectIndex, todoIndex] = getTodoIndex(this.#currentUser["userName"], li.dataset.identifier2, li.dataset.identifier).slice(1);
        cancelConfirm.addEventListener("click", () => {
            confirmDialog.close();
        })
        confirmBtn.addEventListener("click", () => {
            let userName = this.#currentUser["userName"];
            console.log(input.dataset.key, input.value, li.dataset.identifier2, li.dataset.identifier)
            this.#userClass.updateTodo(
                input.dataset.key,
                input.value,
                li.dataset.identifier2,
                li.dataset.identifier);
            confirmDialog.close();
            updateDialog.close();
            this.removeDialog();
            this.getCurrentUser(userName);
            let todoName = this.#currentUser["projects"][projectIndex]["todos"][todoIndex]["title"];
            let projectName = this.#currentUser["projects"][projectIndex]["title"];
            this.expandTodo("", true, {identifier: todoName, identifier2: projectName });
            this.hover();
            this.previous(li);
        })

        cancelBtn.addEventListener("click", (e) => {
            updateDialog.close();
        })
        submitBtn.addEventListener("click", (e) => {
            e.preventDefault();
            confirmDialog.showModal();
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

    previous(element) {
        const previousBtn = document.querySelector("#previous");
        if (!previousBtn)
            return

        previousBtn.addEventListener("click", () => {
            if (element) {
                this.expandProject(element, true, element.dataset.identifier2);

            } else {
                let content = this.renderContent(true);
                let bodyContainer = document.querySelector(".body-container");
                bodyContainer.append(content);
                this.expand()
            }
        })
    }
    add() {
        const addBtn = document.querySelector("#add");
        const create = document.querySelector(".sidebar-actions > a:first-of-type");
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
                // todoTitle, todoPriority, todoDesc, todoDue
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

    createConfirmDialog(newTodo = false, removeTodo = false, updateTodo = false) {
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
            confirmMessage.textContent = "Confirm removing todo?";
        else if (updateTodo)
            confirmMessage.textContent = "Confirm updating todo";
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
        dialog.append(form); expandTodo
        content.append(dialog);
    }
    expandTodo(e, refresh = false, projectIdentifier = "") {
        const parentIdentifier = !!e.currentTarget ? e.currentTarget.parentNode.dataset : undefined
        const project = !parentIdentifier ? projectIdentifier.identifier2 : parentIdentifier.identifier2;
        const todoIdentifier = !parentIdentifier ? projectIdentifier.identifier : parentIdentifier.identifier;
        console.log(this.#currentUser["userName"], project, todoIdentifier);
        const [projectIndex, todoIndex] = getTodoIndex(this.#currentUser["userName"], project, todoIdentifier).slice(1);
        const todo = this.#currentUser["projects"][projectIndex]["todos"][todoIndex];
        console.log(todo);

        const content = document.querySelector(".content");
        const todoContainer = document.createElement("div");
        const todoTitle = document.createElement("div");
        const todoPriority = document.createElement("div");
        const todoDesc = document.createElement("div");
        const todoDue = document.createElement("div");

        const pDue = document.createElement("p");
        const pPriority = document.createElement("p");

        const switchLabel = document.createElement("label");
        const status = document.createElement("input");
        const slider = document.createElement("span");

        const returnDiv = document.createElement("div");
        const previousBtn = document.createElement("button");
        const previousImg = document.createElement("img");
        const ul = document.createElement("ul");

        if (refresh) {
            console.log(`content is being refreshed`)
            content.textContent = "";
        }
        else this.switchView();

        todoContainer.className = "todo-container";
        todoTitle.className = "todo-title";
        todoPriority.className = "todo-priority";
        todoDesc.className = "todo-description";
        todoDue.className = "todo-dueDate"

        switchLabel.className = "switch";
        status.type = "checkbox";
        slider.className = "slider";

        returnDiv.className = "return";
        previousImg.src = previousIcon;
        Object.assign(previousBtn, {
            type: "button",
            id: "previous"
        })

        todoTitle.textContent = todo["title"];
        todoDesc.textContent = todo["description"];
        todoPriority.textContent = "Priority:";
        todoDue.textContent = "Due on:"
        pDue.textContent = todo["dueDate"];
        pPriority.textContent = todo["priority"];

        todoPriority.append(pPriority);
        todoDue.append(pDue);
        switchLabel.append(status, slider);
        previousBtn.append(previousImg);
        returnDiv.append(previousBtn);

        const arr = [todoTitle, todoDesc, todoPriority, todoDue, switchLabel]

        for (let element of arr) {
            const li = document.createElement("li");
            li.className = "expand-todo";
            li.dataset.identifier = todoIdentifier;
            li.dataset.identifier2 = project

            if (element.textContent === todo["title"]) {
                element.append(returnDiv);
            }

            const editAction = document.createElement("div");
            const editImg = document.createElement("img");
            editAction.className = "edit";
            editImg.src = editIcon;
            editAction.append(editImg);

            li.append(element, editAction),
                ul.append(li);
        }
        todoContainer.append(ul);
        content.append(todoContainer);
        content.classList.add("todo-edit");
    }


}