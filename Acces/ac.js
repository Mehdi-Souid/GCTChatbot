class AccesChoice {
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

        chatbox.appendChild(createBotListe('Veuillez sélectionner le type d\'accès que vous souhaitez demander:', "respond"));

        const respondChoice = document.createElement("li");
        respondChoice.classList.add("respond_choice");
        respondChoice.innerHTML = `
            <button id="domaine" class="chat_send">Domaine</button>
            <button id="nas" class="chat_send">NAS</button>
            <button id="ivara" class="chat_send">Ivara</button>
            <button id="si" class="chat_send">SI</button>
        `;
        chatbox.appendChild(respondChoice);

        document.getElementById('domaine').addEventListener('click', () => this.handleChoice('Domaine'));
        document.getElementById('nas').addEventListener('click', () => this.handleChoice('NAS'));
        document.getElementById('ivara').addEventListener('click', () => this.handleChoice('Ivara'));
        document.getElementById('si').addEventListener('click', () => this.handleChoice('SI'));
    }

    handleChoice(choice) {
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
            chatbox.appendChild(createBotListe('D\'accord, vous avez sélectionné ' + choice + '. Veuillez fournir plus de détails.', "respond"));
        }, 600);

        const respondChoice = document.querySelector(".respond_choice");
        if (respondChoice) respondChoice.style.display = 'none';
    }
}
