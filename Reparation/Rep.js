class ReparationChoice {
    //class for reparation
    constructor(chatbox, chatInput, btnreturn) {
        this.args = {
            chatbox: chatbox,
            chatInput: chatInput,
            btnreturn: btnreturn
        };
        this.initialize();
    }

    initialize() {
        const { btnreturn } = this.args;

        // Add event listener to the return button to refresh the page
        if (btnreturn && typeof btnreturn.addEventListener === 'function') {
            btnreturn.addEventListener('click', () => this.refreshPage());  // Refresh page on click
        } else {
            console.error('Invalid btnreturn element or missing addEventListener function');
        }
    }

    refreshPage() {
        // Reload the page to start over
        window.location.reload();
    }

    addChoices() {
        const { chatbox } = this.args;

        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = `<div class="messaget message_bot">${message}</div>`;
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
        const { chatbox } = this.args;

        const createChatListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = `<div class="messaget message_client">${message}</div>`;
            chatliste.innerHTML = chatCont;
            return chatliste;
        };

        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = `<div class="messaget message_bot">${message}</div>`;
            chatliste.innerHTML = chatCont;
            return chatliste;
        };

        chatbox.appendChild(createChatListe(choice, "ask"));
        setTimeout(() => {
            chatbox.appendChild(createBotListe(`D'accord, nous allons réparer votre ${choice}. Veuillez fournir plus de détails.`, "respond"));
        }, 600);

        const respondChoice = document.querySelector(".respond_choice");
        if (respondChoice) respondChoice.style.display = 'none';
    }
}
