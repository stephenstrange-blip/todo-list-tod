import { getUserList, getUserIndex } from "./db";
import expandIcon from "./assets/plus.svg"

export class Session {
    #currentUser;

    getCurrentUser(name) {
        this.name = name;
        let userList = getUserList();
        let userIndex = getUserIndex(this.name);
        this.#currentUser = userList[userIndex];
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
    };

    renderContent() {
        const content = document.createElement("div");
        content.classList.add("content", "project-view")
        let projectList = this.#currentUser["projects"];
        for (let project of projectList) {
            let temp = this.renderProject(project);
            content.append(temp);
        }
        return content;
    }
    renderProject(project, refresh = false) {
        if (refresh) {
            const oldProjectTitle = document.querySelector(`.title[data-identifier=${project[title]}]`);
            const oldProjectDesc = document.querySelector(`.desc[data-identifier=${project[title]}]`);
            const oldProjectDue = document.querySelector(`.dueDate[data-identifier=${project[title]}]`);
            const oldProjectStatus = document.querySelector(`status[data-identifier=${project[title]}]`);
            const oldTodoPeek = document.querySelector(`.todo-peek[data-identifier=${project[title]}]`);

            oldProjectTitle.textContent = project["title"];
            oldProjectDesc.textContent = project["description"];
            oldProjectDue.textContent = project["dueDate"];
            oldProjectStatus.textContent = project["status"] === true ? "Complete" : "Incomplete";

            const todoList = project["todos"];
            const todoTitles = todoList === undefined ? "" : todoList.map(todo => todo["title"]);
            oldTodoPeek.textContent = todoTitles === "" ? "" : todoTitles.join(`:\n`);
            return
        }

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

        userDiv.append(userIcon, userName);
        actions.append(create, setting, about, email);
        sideBar.append(userDiv, actions);

        return sideBar;
    }

    renderTodoList() {

    }

    handleActionHover() {
        const titleParents = document.querySelectorAll(".todo-container > ul > li");
        console.log(titleParents);

        function show(e, mouseOut) {
            let identifier = e.currentTarget.dataset.identifier;
            let [add, remove, edit] = document.querySelectorAll(`li[data-identifier=${identifier}] > .todo-title ~ div`);
            if (!mouseOut) {
                add.style.opacity = .6;
                remove.style.opacity = .6;
                edit.style.opacity = .6;

            } else {
                add.style.opacity = 0;
                remove.style.opacity = 0;
                edit.style.opacity = 0;
            }

        }
        for (let liElement of titleParents) {
            // console.log(title)
            liElement.addEventListener("mouseover", (e) => { show(e), false });
            liElement.addEventListener("mouseout", (e) => { show(e, true) })
        }
    }

    static startSession() {
        renderIntro();
    }
}