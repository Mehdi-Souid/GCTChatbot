class DemandeChoice {
    constructor(chatbox, chatInput) {
        this.args = {
            chatbox: chatbox,
            chatInput: chatInput
        };
    }

    addChoices() {
        const { chatbox, chatInput } = this.args;

        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = classname === "respond" ? `<div class="messaget message_bot">${message}</div>` : `<div class="messaget message_bot">${message}</div>`;
            chatliste.innerHTML = chatCont;
            return chatliste;
        };

        chatbox.appendChild(createBotListe('Quel type de matériel souhaitez-vous demander?', "respond"));

        const respondChoice = document.createElement("li");
        respondChoice.classList.add("respond_choice");
        respondChoice.innerHTML = `
            <button id="equipements" class="chat_send">Équipements</button>
            <button id="consommables" class="chat_send">Consommables</button>
        `;
        chatbox.appendChild(respondChoice);

        document.getElementById('equipements').addEventListener('click', () => this.handleMainChoice('Équipements'));
        document.getElementById('consommables').addEventListener('click', () => this.handleMainChoice('Consommables'));
    }

    handleMainChoice(choice) {
        const { chatbox, chatInput } = this.args;

        const createChatListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = classname === "ask" ? `<div class="messaget message_client">${message}</div>` : `<div class="messaget message_client">${message}</div>`;
            chatliste.innerHTML = chatCont;
            return chatliste;
        };

        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = classname === "respond" ? `<div class="messaget message_bot">${message}</div>` : `<div class="messaget message_bot">${message}</div>`;
            chatliste.innerHTML = chatCont;
            return chatliste;
        };

        chatbox.appendChild(createChatListe(choice, "ask"));

        if (choice === 'Équipements') {
            chatbox.appendChild(createBotListe('Quel type d\'équipement souhaitez-vous demander?', "respond"));

            const respondChoice = document.createElement("li");
            respondChoice.classList.add("responds");
            respondChoice.innerHTML = `
                <button id="imprimante" class="chat_send">Imprimante</button>
                <button id="ordinateur" class="chat_send">Ordinateur</button>
                <button id="switcher" class="chat_send">Switcher</button>
            `;
            chatbox.appendChild(respondChoice);

            document.getElementById('imprimante').addEventListener('click', () => this.handleSubChoice('Imprimante'));
            document.getElementById('ordinateur').addEventListener('click', () => this.handleSubChoice('Ordinateur'));
            document.getElementById('switcher').addEventListener('click', () => this.handleSubChoice('Switcher'));
        } else if (choice === 'Consommables') {
            chatbox.appendChild(createBotListe('Quel type de consommables souhaitez-vous demander?', "respond"));

            const respondChoice = document.createElement("li");
            respondChoice.classList.add("responds");
            respondChoice.innerHTML = `
                <button id="clavier" class="chat_send">Clavier</button>
                <button id="souris" class="chat_send">Souris</button>
                <button id="cartouches" class="chat_send">Cartouches imprimantes</button>
            `;
            chatbox.appendChild(respondChoice);

            document.getElementById('clavier').addEventListener('click', () => this.handleSubChoice('Clavier'));
            document.getElementById('souris').addEventListener('click', () => this.handleSubChoice('Souris'));
            document.getElementById('cartouches').addEventListener('click', () => this.handleSubChoice('Cartouches imprimantes'));
        }

        const respondChoice = document.querySelector(".respond_choice");
        if (respondChoice) respondChoice.style.display = 'none';
    }

    handleSubChoice(choice) {
        const { chatbox, chatInput } = this.args;

        const createChatListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = classname === "ask" ? `<div class="messaget message_client">${message}</div>` : `<div class="messaget message_client">${message}</div>`;
            chatliste.innerHTML = chatCont;
            return chatliste;
        };

        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = classname === "respond" ? `<div class="messaget message_bot">${message}</div>` : `<div class="messaget message_bot">${message}</div>`;
            chatliste.innerHTML = chatCont;
            return chatliste;
        };

        chatbox.appendChild(createChatListe(choice, "ask"));
        setTimeout(() => {
            chatbox.appendChild(createBotListe('D\'accord, nous allons traiter votre demande pour ' + choice + '. Veuillez fournir plus de détails.', "respond"));
        }, 600);

        const respondChoice = document.querySelector(".responds");
        if (respondChoice) respondChoice.style.display = 'none';
    }
}
