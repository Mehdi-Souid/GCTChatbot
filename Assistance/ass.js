class AssistanceChoice {
    constructor(chatbox, chatInput, returnButton) {
        this.args = {
            chatbox: chatbox,
            chatInput: chatInput,
            returnButton: returnButton
        };
        this.history = []; // navigation history
        this.initialize();
    }

    initialize() {
        const { returnButton } = this.args;
        
        if (returnButton && typeof returnButton.addEventListener === 'function') {
            returnButton.addEventListener('click', () => this.returnToPreviousLevel());
        } else {
            console.log('Invalid returnButton element or missing addEventListener function');
        }
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

        chatbox.appendChild(createBotListe('Veuillez sélectionner le type d\'assistance que vous souhaitez demander:', "respond"));

        const respondChoice = document.createElement("li");
        respondChoice.classList.add("respond_choice");
        respondChoice.innerHTML = `
            <button id="Determine_ip" class="chat_send">Déterminer l'adresse IP</button>
            <button id="raccourci" class="chat_send">Créer un raccourci</button>
            <button id="Dossier_partage" class="chat_send">Créer un dossier de partage</button>
        `;
        chatbox.appendChild(respondChoice);

        document.getElementById('Determine_ip').addEventListener('click', () => this.handleChoice('Déterminer l\'adresse IP'));
        document.getElementById('raccourci').addEventListener('click', () => this.handleChoice('Créer un raccourci'));
        document.getElementById('Dossier_partage').addEventListener('click', () => this.handleChoice('Créer dossier de partage'));

        // Save history 
        this.history.push('assistance');
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

    returnToPreviousLevel() {
        const { chatbox } = this.args;

        const respondChoice = document.querySelector(".respond_choice");
        if (respondChoice) respondChoice.style.display = 'none';

        chatbox.innerHTML = '';

        const previousLevel = this.history.pop();
        if (previousLevel === 'assistance') {
            this.addChoices(); 
        }
    }
}
