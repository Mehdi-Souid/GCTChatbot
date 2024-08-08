class ConfigurationChoice {
    constructor(chatbox, chatInput) {
        this.args = {
            chatbox: chatbox,
            chatInput: chatInput
        };
    }

    addChoices() {
        const { chatbox } = this.args;

        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = classname === "respond" ? `<div class="messaget message_bot">${message}</div>` : `<div class="messaget message_bot">${message}</div>`;
            chatliste.innerHTML = chatCont;
            return chatliste;
        };

        chatbox.appendChild(createBotListe('Voulez-vous configurer iVARA ou SI ou SWeb?', "respond"));

        const respondChoice = document.createElement("li");
        respondChoice.classList.add("respond_choice");
        respondChoice.innerHTML = `
            <button id="iVARA" class="chat_send">iVARA</button>
            <button id="SI" class="chat_send">SI</button>
            <button id="SIWeb" class="chat_send">SI Web</button>
        `;
        chatbox.appendChild(respondChoice);

        document.getElementById('iVARA').addEventListener('click', () => this.handleChoice('iVARA'));
        document.getElementById('SI').addEventListener('click', () => this.handleChoice('SI'));
        document.getElementById('SIWeb').addEventListener('click', () => this.handleChoice('SI Web'));
    }

    handleChoice(choice) {
        const { chatbox } = this.args;

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

        if (choice === 'iVARA') {
            setTimeout(() => {
                chatbox.appendChild(createBotListe('Il y a-t-il un Probléme démarrage ou Imprerssion Ivara?', "respond"));

                const respondChoice = document.createElement("li");
                respondChoice.classList.add("responds");
                respondChoice.innerHTML = 
                   ` <button id="probleme_demarrage" class="chat_send">Probléme démarrage</button>
                    <button id="impression_ivara" class="chat_send">Impression Ivara</button>`
                ;
                chatbox.appendChild(respondChoice);

                document.getElementById('probleme_demarrage').addEventListener('click', () => this.handleSubChoice('Probléme démarrage'));
                document.getElementById('impression_ivara').addEventListener('click', () => this.handleSubChoice('Impression Ivara'));

            }, 600);
        } else {
            setTimeout(() => {
                chatbox.appendChild(createBotListe('D\'accord, nous allons vous aider avec ' + choice + '. Veuillez fournir plus de détails.', "respond"));
            }, 600);
        }

        const respondChoice = document.querySelector(".respond_choice");
        if (respondChoice) respondChoice.style.display = 'none';
    }

    handleSubChoice(subChoice) {
        const { chatbox } = this.args;
    
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
    
        chatbox.appendChild(createChatListe(subChoice, "ask"));
        setTimeout(() => {
            chatbox.appendChild(createBotListe('D\'accord, nous allons vous aider avec ' + subChoice + '. Veuillez fournir plus de détails.', "respond"));
        }, 600);
    
        const respondChoice = document.querySelector(".responds");
        if (respondChoice) respondChoice.style.display = 'none';
        
    }
    
}
