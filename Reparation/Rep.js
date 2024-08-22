class ReparationChoice {
    constructor(chatbox, chatInput, btnreturn, chatsendbtn) {
        this.args = {
            chatbox: chatbox,
            chatInput: chatInput,
            btnreturn: btnreturn,
            chatsendbtn: chatsendbtn
        };
        this.currentState = 'main'; // Track the current state
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
            this.currentState = 'main'; // Switch to main state
            this.addChoices('main'); 
        } else {
            chatbox.innerHTML = ''; 

            const autoRespond = new AutoRespond(this.args.chatbox, this.args.chatInput, this.args.btnreturn, this.args.chatsendbtn);
        }

        this.setupReturnButtonListener();
    }

    addChoices(state) {
        const { chatbox, chatInput } = this.args;
        chatbox.innerHTML = '';
        let userMessage;
        userMessage = 'Reparation Materiel';
        const messageAdd = new MessageRespond(this.args.chatInput, this.args.chatbox);
        messageAdd.addMessage(userMessage);
        if (state === 'main') {
            this.currentState = 'main'; // Update state to main

            const createBotListe = (message, classname) => {
                const chatliste = document.createElement("li");
                chatliste.classList.add("chat", classname);
                chatliste.innerHTML = `<div class="messaget message_bot">${message}</div>`;
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
        } else if (state === 'sub') {
            this.currentState = 'sub'; // Update state to sub
        }
    }

    handleChoice(choice) {
        const { chatbox } = this.args;

        const createChatListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            chatliste.innerHTML = `<div class="messaget message_client">${message}</div>`;
            return chatliste;
        };

        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            chatliste.innerHTML = `<div class="messaget message_bot">${message}</div>`;
            return chatliste;
        };

        chatbox.appendChild(createChatListe(choice, "ask"));
        
        let detailsMessage, choices;
        if (choice === 'Imprimante') {
            detailsMessage = 'Merci de préciser la nature de panne (bourrage papier, tire papier) en mentionnant le code immobilisation au sein d\'un ticket.';
            choices = ['bourrage papier', 'tire papier'];
        } else if (choice === 'PC') {
            detailsMessage = 'Merci de préciser la nature de panne (problème démarrage, arrêt brusque) en mentionnant le code immobilisation au sein d\'un ticket.';
            choices = ['problème démarrage', 'arrêt brusque'];
        }

        setTimeout(() => {
            chatbox.appendChild(createBotListe(`Vous avez choisi de réparer un ${choice}. ${detailsMessage}`, "respond"));
            this.showConfirmation(choices, choice);
        }, 600);

        const respondChoice = document.querySelector(".respond_choice");
        if (respondChoice) respondChoice.style.display = 'none';
    }

    showConfirmation(choices, issueType) {
        const { chatbox } = this.args;

        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            chatliste.innerHTML = `<div class="messaget message_bot">${message}</div>`;
            return chatliste;
        };

        const createChatListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            chatliste.innerHTML = `<div class="messaget message_client">${message}</div>`;
            return chatliste;
        };

        const confirmChoices = choices.map(choice => `
            <button class="chat_send" data-choice="${choice}">${choice}</button>
        `).join('');

        chatbox.appendChild(createBotListe('Veuillez confirmer la nature de panne:', "respond"));

        const choiceList = document.createElement("li");
        choiceList.classList.add("respond_choice");
        choiceList.innerHTML = confirmChoices;
        chatbox.appendChild(choiceList);

        

        document.querySelectorAll('.respond_choice .chat_send[data-choice]').forEach(button => {
            button.addEventListener('click', () => this.handleDescriptionConfirmation(button.dataset.choice));
        });

    }

    handleDescriptionConfirmation(choice) {
        const { chatbox } = this.args;

        chatbox.innerHTML = '';

        // Display confirmation message
        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            chatliste.innerHTML = `<div class="messaget message_bot">${message}</div>`;
            return chatliste;
        };

        chatbox.appendChild(createBotListe(`Vous avez confirmé: ${choice}. Êtes-vous sûr de vouloir continuer ?`, "respond"));

        const confirmationButtons = document.createElement("li");
        confirmationButtons.classList.add("respond_choice");
        confirmationButtons.innerHTML = `
            <button id="confirm" class="chat_send">Confirmer</button>
            <button id="cancel" class="chat_send">Annuler</button>
        `;
        chatbox.appendChild(confirmationButtons);
        document.getElementById('confirm').addEventListener('click', () => this.createTicket(choice));
        document.getElementById('cancel').addEventListener('click', () => this.handleReturnButton());
    }

    createTicket(issueType) {
        const { chatbox } = this.args;
    
        chatbox.innerHTML = '';
    
        // Display ticket creation message
        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            chatliste.innerHTML = `<div class="messaget message_bot">${message}</div>`;
            return chatliste;
        };
    
        chatbox.appendChild(createBotListe(`Votre ticket pour ${issueType} est en cours de création. Veuillez patienter.`, "respond"));
    
        // Prepare ticket data
        const ticketData = {
            username: 'glpi', 
            password: 'glpi', 
            ticket_name: `Repair Request for ${issueType}`, 
            ticket_description: `Description for ${issueType} issue` 
        };
    
        // Send ticket data to server
        fetch('create_ticket.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(ticketData)
        })
        .then(response => response.text())
        .then(data => {
            chatbox.innerHTML = ''; 
            chatbox.innerHTML = data; 
        })
        .catch(error => {
            console.error('Error:', error);
        });
    
        // Provide option to return to main choices
        const returnButton = document.createElement("button");
        returnButton.classList.add("chat_send");
        returnButton.innerText = "Retourner aux choix principaux";
        returnButton.addEventListener('click', () => {
            chatbox.innerHTML = '';
            const autoRespond = new AutoRespond(this.args.chatbox, this.args.chatInput, this.args.btnreturn, this.args.chatsendbtn);
        });
    
        chatbox.appendChild(returnButton);
    }
    
}
