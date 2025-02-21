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

    renderContent(refresh = false){
        const content = document.createElement("div");
        const project = document.createElement("div");
        const projectTitle = document.createElement("div");
        const projectDesc = document.createElement("div");
        const projectDue = document.createElement("div");
        const projectStatus = document.createElement("div");
        const todoPeek = document.createElement("div");
        const expand = document.createElement("div");

        const expandIconHolder = document.createElement("img");
        const dueHolder = document.createElement("p");
        const statusHolder = document.createElement("p");

        const todoList = this.#currentUser["projects"][0]["todos"];
        const todoTitles = todoList.map(todo => todo["title"])

        content.className = "content";
        project.className = "project";
        projectTitle.className = "title";
        projectDesc.className = "desc";
        projectDue.className = "dueDate";
        projectStatus.className = "status";
        todoPeek.className = "todo-peek";
        expand.className = "expand";

        projectTitle.textContent = this.#currentUser["projects"][0]["title"];
        projectDesc.textContent = this.#currentUser["projects"][0]["description"];
        projectDue.textContent = "Due on:"
        dueHolder.textContent = this.#currentUser["projects"][0]["dueDate"];
        projectStatus.textContent = "Progress: ";
        statusHolder.textContent = this.#currentUser["projects"][0]["status"] === true ? "Complete" : "Incomplete"
        todoPeek.textContent = todoTitles.join(":\n");
        expandIconHolder.src = expandIcon;

        projectDue.append(dueHolder);
        projectStatus.append(statusHolder);
        expand.append(expandIconHolder);
        project.append(projectTitle, projectDesc, projectDue, projectStatus, todoPeek);
        content.append(project);

        return content;
    }

    renderHeader(refresh = false){
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
    renderSidebar() {
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
}