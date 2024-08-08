class MessageRespond {
    constructor(chatInput, chatbox) {
        this.args = {
            chatInput: chatInput,
            chatbox: chatbox
        };
        this.initialize();
    }

    initialize() {
        const { chatInput, chatbox } = this.args;

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

        this.createChatListe = createChatListe;
        this.createBotListe = createBotListe;
    }

    addMessage(userMessage) {
        const { chatbox } = this.args;

        const userMessageElem = this.createChatListe(userMessage, "ask");
        chatbox.appendChild(userMessageElem);

    }
}
