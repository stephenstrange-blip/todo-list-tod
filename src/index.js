import "./css_reset.css";
import "./styles.css";
import { saveToDb } from "./db.js"

class User {
        users;
        constructor(name) {
            this.users = {users : name}
        }

        updateUserDb() {
            saveToDb(this.users);
        }
}

// let user1 = new User("Jeremiah").updateUserDb();
localStorage.clear()