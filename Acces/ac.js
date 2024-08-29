class AccessChoice {
    constructor(chatbox, chatInput, btnreturn, chatsendbtn) {
        this.args = {
            chatbox: chatbox,
            chatInput: chatInput,
            btnreturn: btnreturn,
            chatsendbtn: chatsendbtn
        };
        this.currentState = 'main'; // Track the current state
        this.inputQueue = []; // Queue to manage inputs
        this.inputTable = {}; // Table to store inputs
        this.title="";
        this.initialize();
    }

    initialize() {
        const { btnreturn } = this.args;
        this.addChoices('main'); 
        this.setupReturnButtonListener();
    }

    setupReturnButtonListener() {
        const { btnreturn } = this.args;

        btnreturn.removeEventListener('click', this.handleReturnButton.bind(this));
        btnreturn.addEventListener('click', () => this.handleReturnButton());
    }

    handleReturnButton() {
        const { chatbox, btnreturn } = this.args;
        
        if (this.currentState === 'sub') {
            this.currentState = 'main'; 
            this.addChoices('main'); 
        } else {
            chatbox.innerHTML = ''; 
            const autoRespond = new AutoRespond(this.args.chatbox, this.args.chatInput, this.args.btnreturn, this.args.chatsendbtn);
        }

        this.setupReturnButtonListener();
    }

    addChoices(state) {
        const { chatbox } = this.args;
        chatbox.innerHTML = '';
        let userMessage;
        userMessage = 'Demande Accès';
        const messageAdd = new MessageRespond(this.args.chatInput, this.args.chatbox);
        messageAdd.addMessage(userMessage);
        if (state === 'main') {
            this.currentState = 'main'; 

            const createBotListe = (message, classname) => {
                const chatliste = document.createElement("li");
                chatliste.classList.add("chat", classname);
                chatliste.innerHTML = `<div class="messaget message_bot">${message}</div>`;
                return chatliste;
            };

            chatbox.appendChild(createBotListe('Quel type d\'accès demandez-vous ?', "respond"));

            const respondChoice = document.createElement("li");
            respondChoice.classList.add("respond_choice");
            respondChoice.innerHTML = `
                <button id="domaine" class="chat_send">Domaine</button>
                <button id="nas" class="chat_send">NAs</button>
                <button id="ivara" class="chat_send">Ivara</button>
                <button id="si" class="chat_send">SI</button>
            `;
            chatbox.appendChild(respondChoice);

            document.getElementById('domaine').addEventListener('click', () => this.handleDomaineChoice("Domaine"));
            document.getElementById('nas').addEventListener('click', () => this.handleNasChoice("NAS"));
            document.getElementById('ivara').addEventListener('click', () => this.handleIvaraChoice("iVARA"));
            document.getElementById('si').addEventListener('click', () => this.handleSiChoice("SI"));
        }
    }

    handleDomaineChoice() {
        this.currentState = 'domaine'; 
        const { chatbox,title } = this.args;
        
        chatbox.innerHTML = '';

        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            chatliste.innerHTML = `<div class="messaget message_bot">${message}</div>`;
            return chatliste;
        };

        const createChatListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = `<div class="messaget message_client">${message}</div>`;
            chatliste.innerHTML = chatCont;
            return chatliste;
        };

        chatbox.appendChild(createChatListe("Domaine", "ask"));


        chatbox.appendChild(createBotListe('Merci de préciser ton matricule, ton adresse IP, la nature d\'erreur d\'accès, et le domaine actuel.', "respond"));

        this.inputQueue = [
            { prompt: 'Matricule:', key: 'matricule', handler: this.handleInput.bind(this) },
            { prompt: 'Adresse IP:', key: 'adresse ip', handler: this.handleInput.bind(this) },
            { prompt: 'Nature d\'erreur:', key: 'nature erreur', handler: this.handleInput.bind(this) },
            { prompt: 'Domaine actuel:', key: 'domaine actual', handler: this.handleInput.bind(this) }
        ];
        this.title="Domaine";
        this.requestInput();
    }

    handleNasChoice() {
        this.currentState = 'nas'; 
        const { chatbox,title } = this.args;
        
        chatbox.innerHTML = '';

        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            chatliste.innerHTML = `<div class="messaget message_bot">${message}</div>`;
            return chatliste;
        };

        const createChatListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = `<div class="messaget message_client">${message}</div>`;
            chatliste.innerHTML = chatCont;
            return chatliste;
        };

        chatbox.appendChild(createChatListe("NAS", "ask"));

        chatbox.appendChild(createBotListe('Merci de préciser les dossiers auxquels vous aimeriez accéder.', "respond"));

        this.inputQueue = [
            { prompt: 'Dossiers:', key: 'Dossier', handler: this.handleInput.bind(this) }
        ];
        this.title="NAS";
        this.requestInput();
    }

    handleIvaraChoice() {
        this.currentState = 'ivara'; 
        const { chatbox,title } = this.args;
        
        chatbox.innerHTML = '';

        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            chatliste.innerHTML = `<div class="messaget message_bot">${message}</div>`;
            return chatliste;
        };

        const createChatListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = `<div class="messaget message_client">${message}</div>`;
            chatliste.innerHTML = chatCont;
            return chatliste;
        };

        chatbox.appendChild(createChatListe("iVARA", "ask"));

        chatbox.appendChild(createBotListe('Merci d\'indiquer un profil similaire.', "respond"));

        this.inputQueue = [
            { prompt: 'Profil similaire:', key: 'profile similaire', handler: this.handleInput.bind(this) }
        ];
         this.title="iVARA";
        this.requestInput();
    }

    handleSiChoice() {
        this.currentState = 'si'; 
        const { chatbox,title } = this.args;
        
        chatbox.innerHTML = '';

        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            chatliste.innerHTML = `<div class="messaget message_bot">${message}</div>`;
            return chatliste;
        };

        const createChatListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = `<div class="messaget message_client">${message}</div>`;
            chatliste.innerHTML = chatCont;
            return chatliste;
        };

        chatbox.appendChild(createChatListe("SI", "ask"));

        chatbox.appendChild(createBotListe('Merci d\'indiquer un profil similaire.', "respond"));

        this.inputQueue = [
            { prompt: 'Profil similaire:', key: 'profiles similaire', handler: this.handleInput.bind(this) }
        ];
        this.title="SI";
        this.requestInput();
    }

    requestInput() {
        const { chatInput, chatsendbtn } = this.args;
        if (this.inputQueue.length === 0) {
            this.completeChoice();
            return;
        }

        const currentInput = this.inputQueue.shift();
        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            chatliste.innerHTML = `<div class="messaget message_bot">${message}</div>`;
            return chatliste;
        };

        this.args.chatbox.appendChild(createBotListe(currentInput.prompt, "respond"));

        chatInput.focus();
        chatsendbtn.addEventListener('click', () => {
            const value = chatInput.value;
            if (value) {
                chatInput.value = '';
                this.inputTable[currentInput.key] = value; // Store the input in the table
                currentInput.handler(value);
            }
        }, { once: true });
    }

    handleInput(value) {
        const { chatbox } = this.args;
        const createChatListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = `<div class="messaget message_client">${message}</div>`;
            chatliste.innerHTML = chatCont;
            return chatliste;
        };

        chatbox.appendChild(createChatListe(value, "ask"));
        // Continue requesting the next input
        this.requestInput();
    }

    completeChoice() {
        const { chatbox } = this.args;

        let description = 'Demande d\'accès:\n';

        for (let key in this.inputTable) {
            description += `${key}: ${this.inputTable[key]}\n`;
        }

        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            chatliste.innerHTML = `<div class="messaget message_bot">${message}</div>`;
            return chatliste;
        };

        chatbox.appendChild(createBotListe('Résumé de votre demande:', "respond"));
        chatbox.appendChild(createBotListe(description, "respond"));
        this.createTicket(description);
    }

    createTicket(description) {
        const { chatbox,title} = this.args;
        chatbox.innerHTML="";

        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            chatliste.innerHTML = `<div class="messaget message_bot">${message}</div>`;
            return chatliste;
        };

        const ticket_title= "Demande d\' acces : " + this.title
    
        chatbox.appendChild(createBotListe('Votre demande est en cours de création. Veuillez patienter.', "respond"));
    
        // Prepare ticket data
        const ticketData = {
            //password and username (old)
            ticket_name: ticket_title,
            ticket_description: description,
            type: 1,  // ID for incident
            category: 1  // Default category ID
        };
        setTimeout(() => {
       
        fetch('create_ticket.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(ticketData)
        })
        .then(response => response.text())
        .then(data => {
            // Clear the chatbox and display the server response
            chatbox.innerHTML = '';
            chatbox.innerHTML = data; 
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, 3000);
    }
    
}
