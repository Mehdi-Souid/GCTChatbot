class ReparationChoice {
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

        chatbox.appendChild(createBotListe('Voulez-vous réparer une imprimante ou un PC?', "respond"));

        const respondChoice = document.createElement("li");
        respondChoice.classList.add("respond_choice");
        respondChoice.innerHTML = `
            <button id="printer" class="chat_send">Imprimante</button>
            <button id="pc" class="chat_send">PC</button>
        `;
        chatbox.appendChild(respondChoice);

        document.getElementById('printer').addEventListener('click', () => this.handleChoice('Imprimante'));
        document.getElementById('pc').addEventListener('click', () => this.handleChoice('PC'));
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
            chatbox.appendChild(createBotListe('D\'accord, nous allons réparer votre ' + choice + '. Veuillez fournir plus de détails.', "respond"));
        }, 600);

        const respondChoice = document.querySelector(".respond_choice");
        if (respondChoice) respondChoice.style.display = 'none';
    }
}
