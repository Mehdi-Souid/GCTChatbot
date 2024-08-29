class DemandeChoice {
    constructor(chatbox, chatInput, btnreturn, chatSendBtn) {
        this.args = {
            chatbox: chatbox,
            chatInput: chatInput,
            chatSendBtn: chatSendBtn,
            btnreturn: btnreturn,
        };
        this.currentState = 'main'; // Track the current state
        this.selectedChoice = null; // Track the selected sub-choice
        this.searchConsumable = new SearchConsumable(chatbox);
        this.args.chatInput.disabled = true;
        this.initialize();   
    }

    initialize() {
        this.addChoices(); 
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
            this.addChoices(); 
        } else {
            chatbox.innerHTML = ''; 

            const autoRespond = new AutoRespond(this.args.chatbox, this.args.chatInput, this.args.btnreturn, this.args.chatSendBtn);
        }

        this.setupReturnButtonListener();
    }

    addChoices() {
        const { chatbox } = this.args;
        chatbox.innerHTML = '';

        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = `<div class="messaget message_bot">${message}</div>`;
            chatliste.innerHTML = chatCont;
            return chatliste;
        };

        chatbox.appendChild(createBotListe('Quel type de matériel souhaitez-vous demander?', "respond"));

        const respondChoice = document.createElement("li");
        respondChoice.classList.add("respond_choice");
        respondChoice.innerHTML = `
            <button id="equipements" class="chat_send">Équipements</button>
            <button id="consommables" class="chat_send">Consommables</button>
        `;
        chatbox.appendChild(respondChoice);

        document.getElementById('equipements').addEventListener('click', () => this.handleMainChoice('Équipements'));
        document.getElementById('consommables').addEventListener('click', () => this.handleMainChoice('Consommables'));
    }

    handleMainChoice(choice) {
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

        let subChoices = '';
        if (choice === 'Équipements') {
            chatbox.appendChild(createBotListe('Quel type d\'équipement souhaitez-vous demander?', "respond"));
            subChoices = `
                <button id="imprimante" class="chat_send">Imprimante</button>
                <button id="ordinateur" class="chat_send">Ordinateur</button>
                <button id="switcher" class="chat_send">Switcher</button>
            `;
        } else if (choice === 'Consommables') {
            chatbox.appendChild(createBotListe('Quel type de consommables souhaitez-vous demander?', "respond"));
            subChoices = `
                <button id="clavier" class="chat_send">Clavier</button>
                <button id="souris" class="chat_send">Souris</button>
                <button id="cartouches" class="chat_send">Cartouches imprimantes</button>
            `;
        }

        const respondChoice = document.createElement("li");
        respondChoice.classList.add("responds");
        respondChoice.innerHTML = subChoices;
        chatbox.appendChild(respondChoice);

        document.getElementById('imprimante')?.addEventListener('click', () => this.handleSubChoice('Imprimante'));
        document.getElementById('ordinateur')?.addEventListener('click', () => this.handleSubChoice('Ordinateur'));
        document.getElementById('switcher')?.addEventListener('click', () => this.handleSubChoice('Switcher'));
        document.getElementById('clavier')?.addEventListener('click', () => this.handleSubChoice('Clavier'));
        document.getElementById('souris')?.addEventListener('click', () => this.handleSubChoice('Souris'));
        document.getElementById('cartouches')?.addEventListener('click', () => this.handleSubChoice('Cartouches imprimantes'));

        const initialChoice = document.querySelector(".respond_choice");
        if (initialChoice) initialChoice.style.display = 'none';

        this.currentState = 'sub'; // Switch to sub state
    }

    handleSubChoice(choice) {
        const { chatbox, chatInput, chatSendBtn } = this.args;

        const createChatListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = `<div class="messaget message_client">${message}</div>`;
            chatliste.innerHTML = chatCont;
            return chatliste;
        };

        chatbox.appendChild(createChatListe(choice, "ask"));
        this.selectedChoice = choice;

        if (choice === 'Clavier' || choice === 'Souris' || choice === 'Cartouches imprimantes') {
            // For Consumables, ask for the specific material and search for its existence
            chatbox.appendChild(this.searchConsumable.createBotListe('Veuillez entrer le nom du consommable dans le champ de saisie et cliquer sur envoyer.', "respond"));
            chatInput.disabled = false;

            chatSendBtn.addEventListener('click', () => {
                const materialName = chatInput.value.trim();
                if (materialName) {
                    this.searchConsumable.handleChatSendClick(materialName, this.selectedChoice, this.confirmationCallback.bind(this));
                    chatInput.value = '';
                    chatInput.disabled = true;
                } else {
                    this.searchConsumable.createBotListe('Veuillez entrer le nom du consommable dans le champ de saisie.', "respond");
                }
            });
        } else {
            // For other types (PC, Printer, Switcher), directly ask for confirmation
            this.confirmationCallback(this.selectedChoice);
        }

        const subChoiceBtns = document.querySelector(".responds");
        if (subChoiceBtns) subChoiceBtns.style.display = 'none';
    }

    confirmationCallback(materialName) {
        const { chatbox } = this.args;

        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = `<div class="messaget message_bot">${message}</div>`;
            chatliste.innerHTML = chatCont;
            return chatliste;
        };

        chatbox.appendChild(createBotListe(`Vous avez confirmé: ${materialName}. Êtes-vous sûr de vouloir continuer ?`, "respond"));

        const confirmationButtons = document.createElement("li");
        confirmationButtons.classList.add("respond_choice");
        confirmationButtons.innerHTML = `
            <button id="confirm" class="chat_send">Confirmer</button>
            <button id="cancel" class="chat_send">Annuler</button>
        `;
        chatbox.appendChild(confirmationButtons);

        document.getElementById('confirm').addEventListener('click', () => this.createTicket(materialName));
        document.getElementById('cancel').addEventListener('click', () => this.addChoices());
    }

    createTicket(materialName) {
        const { chatbox } = this.args;
    
        chatbox.innerHTML="";

        // Display ticket creation message
        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            chatliste.innerHTML = `<div class="messaget message_bot">${message}</div>`;
            return chatliste;
        };
    
        chatbox.appendChild(createBotListe(`Votre ticket pour ${materialName} est en cours de création. Veuillez patienter.`, "respond"));
    
        // Prepare ticket data
        const ticketData = {
            username: 'glpi', // Replace with actual username from your log
            password: 'glpi', // Replace with actual password from your log
            ticket_name: `Demande de materiel`, 
            ticket_description: `Demande concernant ${materialName}`,
            type: 2,  // ID for requester
            category: 1  // Default category ID
        };
        setTimeout(() => {
            // Code to execute after 5 seconds
        
        
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
            chatbox.innerHTML="";
            chatbox.innerHTML = data; 
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, 3000);
    }
}
