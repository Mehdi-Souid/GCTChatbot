class AccesChoice {
    //class for getting access
    constructor(buttons, chatbox, chatInput, btnreturn, chatsendbtn) {
        this.args = {
            buttons: buttons,
            chatbox: chatbox,
            chatInput: chatInput,
            btnreturn: btnreturn,
            chatsendbtn: chatsendbtn
        };
        this.initialize();
    }

    initialize() {
        const { btnreturn } = this.args;

        
        if (btnreturn && typeof btnreturn.addEventListener === 'function') {
            btnreturn.addEventListener('click', () => this.refreshPage()); 
        } else {
            console.error('Invalid btnreturn element or missing addEventListener function');
        }
    }

    refreshPage() {
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
            chatbox.appendChild(createBotListe(`D'accord, vous avez sélectionné ${choice}. Veuillez fournir plus de détails.`, "respond"));
        }, 600);

        const respondChoice = document.querySelector(".respond_choice");
        if (respondChoice) respondChoice.style.display = 'none';
    }
}
