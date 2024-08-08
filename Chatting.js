class MessageChannel {
    constructor(button, chatInput, chatbox) {
        this.args = {
            button: button,
            chatInput: chatInput,
            chatbox: chatbox
        };
        this.initialize();
    }

    initialize() {
        const { button, chatInput, chatbox } = this.args;

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

        const handleChat = () => {
            const userMessage = chatInput.value.trim();
            if (!userMessage) return;

            const userMessageElem = createChatListe(userMessage, "ask");
            chatbox.appendChild(userMessageElem);
            chatInput.value = ''; 
            
            setTimeout(() => {
                const botMessageElem = createBotListe('Generating...', "respond");
                chatbox.appendChild(botMessageElem);
            }, 600);
        }

        button.addEventListener("click", handleChat);
    }
}
