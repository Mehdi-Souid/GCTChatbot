class ReparationChoice {
    constructor(chatbox, chatInput, btnreturn, chatsendbtn) {
        this.args = {
            chatbox: chatbox,
            chatInput: chatInput,
            btnreturn: btnreturn,
            chatsendbtn: chatsendbtn
        };
        this.currentState = 'main'; // Track the current state
        this.issueType = null; // Store the selected issue type
        this.initialize();
    }

    initialize() {
        this.addChoices('main');
        this.setupReturnButtonListener();
    }

    setupReturnButtonListener() {
        const { btnreturn } = this.args;

        btnreturn.removeEventListener('click', this.handleReturnButton.bind(this));
        
        btnreturn.addEventListener('click', () => this.handleReturnButton());
    }

    handleReturnButton() {
        const { chatbox } = this.args;
        
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
        const { chatbox } = this.args;
        chatbox.innerHTML = '';
        const userMessage = 'Reparation Materiel';
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
            detailsMessage = 'merci de préciser la nature de panne (bourrage papier, tire papier) en mentionnant le code immobilisation.';
            choices = ['bourrage papier', 'tire papier'];
        } else if (choice === 'PC') {
            detailsMessage = 'merci de préciser la nature de panne (problème démarrage, arrêt brusque) en mentionnant le code immobilisation.';
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
    
        const confirmChoices = choices.map(choice => `
            <button class="chat_send" data-choice="${choice}">${choice}</button>
        `).join('');
    
        chatbox.appendChild(createBotListe('Veuillez confirmer la nature de panne et mentionner le code immobilisation:', "respond"));
    
        const choiceList = document.createElement("li");
        choiceList.classList.add("respond_choice");
        choiceList.innerHTML = confirmChoices;
        chatbox.appendChild(choiceList);
    
        document.querySelectorAll('.respond_choice .chat_send[data-choice]').forEach(button => {
            button.addEventListener('click', () => this.handleDescriptionConfirmation(button.dataset.choice));
        });
    }
    

    handleDescriptionConfirmation(choice) {
        const { chatbox, chatInput, chatsendbtn } = this.args;
    
        chatbox.innerHTML = '';
    
        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            chatliste.innerHTML = `<div class="messaget message_bot">${message}</div>`;
            return chatliste;
        };
    
        chatbox.appendChild(createBotListe(`Vous avez confirmé: ${choice}. Veuillez entrer le code immobilisation pour continuer:`, "respond"));
    
        // Wait for the user to enter the immobilization code
        chatsendbtn.addEventListener('click', () => {
            const codeImmobilisation = chatInput.value;
            if (codeImmobilisation) {
                this.createTicket(choice, codeImmobilisation);
            }
            chatInput.value = '';
        }, { once: true });
    }
    
    handleCodeImmobilisationInput() {
        const { chatbox, chatInput } = this.args;

        const codeImmobilisation = chatInput.value.trim(); // Get the code immobilisation input

        if (codeImmobilisation === '') {
            // If input is empty, prompt user to enter code
            chatbox.appendChild(this.createBotListe('Le code d\'immobilisation ne peut pas être vide. Veuillez entrer un code valide.', "respond"));
            return;
        }

        // Clear chat input field after use
        chatInput.value = '';

        // Display the entered code immobilisation
        chatbox.appendChild(this.createChatListe(codeImmobilisation, "ask"));

        // Confirm the ticket creation with the immobilisation code
        setTimeout(() => {
            this.createTicket(this.issueType, codeImmobilisation);
        }, 600);
    }

    createTicket(issueType, codeImmobilisation) {
        const { chatbox } = this.args;
    
        chatbox.innerHTML = '';
        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            chatliste.innerHTML = `<div class="messaget message_bot">${message}</div>`;
            return chatliste;
        };
    
        chatbox.appendChild(createBotListe(`Votre ticket pour ${issueType} est en cours de création avec le code immobilisation: ${codeImmobilisation}. Veuillez patienter.`, "respond"));
    
        const ticketData = {
            ticket_name: `Reparation pour ${issueType}`, 
            ticket_description: `Problème de ${issueType} avec code immobilisation: ${codeImmobilisation}`,
            type: 1,
            category: 1
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
                chatbox.innerHTML = ''; 
                chatbox.appendChild(createBotListe(data, "respond"));
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }, 3000);
    }    
}
