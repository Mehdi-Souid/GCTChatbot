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
        this.args.chatInput.disabled = true;
        this.initialize();   
        this.inputQueue = [];
        this.inputTable = {};
        this.description = '';
        this.title = '';
        this.inputHandler = this.createInputHandler(); // Store the handler reference
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

            // Remove existing event listeners
            const equipmentBtn = document.getElementById('equipements');
            const consumablesBtn = document.getElementById('consommables');
            if (equipmentBtn) {
                equipmentBtn.removeEventListener('click', () => this.handleMainChoice('Équipements'));
            }
            if (consumablesBtn) {
                consumablesBtn.removeEventListener('click', () => this.handleMainChoice('Consommables'));
            }

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
        this.description = '';

        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            chatliste.innerHTML = `<div class="messaget message_bot">${message}</div>`;
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

        this.currentState = 'main'; // Switch to main state
    }

    handleMainChoice(choice) {
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

        document.getElementById('imprimante')?.addEventListener('click', () => this.handlePrinterChoice());
        document.getElementById('ordinateur')?.addEventListener('click', () => this.handlePCChoice());
        document.getElementById('switcher')?.addEventListener('click', () => this.handleSwitchChoice());
        document.getElementById('clavier')?.addEventListener('click', () => this.handleSubChoice('Clavier'));
        document.getElementById('souris')?.addEventListener('click', () => this.handleSubChoice('Souris'));
        document.getElementById('cartouches')?.addEventListener('click', () => this.handleSubChoice('Cartouches imprimantes'));

        const initialChoice = document.querySelector(".respond_choice");
        if (initialChoice) initialChoice.style.display = 'none';

        this.currentState = 'sub'; // Switch to sub state
    }

    handlePCChoice() {
        const { chatbox } = this.args;
        this.description = '';
        this.title='Ordinateur';
        const MainChoice = document.querySelector(".responds");
        if (MainChoice) MainChoice.style.display = 'none';

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

        chatbox.appendChild(createChatListe('Ordinateur sélectionné', "ask"));
        chatbox.appendChild(createBotListe('Merci de préciser le modèle de l\'ordinateur à remplacer ou indiquer s\'il s\'agit d\'une nouvelle affectation.', "respond"));
        this.inputQueue = [
            { prompt: 'Modèle de l\'ordinateur:', key: 'model_ordinateur', handler: this.handleInput.bind(this) }
        ];
        this.requestInput();
    }

    handlePrinterChoice() {
        const { chatbox } = this.args;
        this.description = '';
        this.title='Imprimante';
        const MainChoice = document.querySelector(".responds");
        if (MainChoice) MainChoice.style.display = 'none';
    
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
    
        chatbox.appendChild(createChatListe('Imprimante sélectionnée', "ask"));
        chatbox.appendChild(createBotListe('Merci de préciser le type (réseau ou bureautique).', "respond"));
    
        // Create and display the buttons for selecting the type of printer
        const buttonContainer = document.createElement("li");
        buttonContainer.classList.add("respond_sub");
        buttonContainer.innerHTML = `
            <button id="reseau" class="chat_send">Réseau</button>
            <button id="bureautique" class="chat_send">Bureautique</button>
        `;
        chatbox.appendChild(buttonContainer);
    
        document.getElementById('reseau').addEventListener('click', () => this.handlePrinterType('réseau'));
        document.getElementById('bureautique').addEventListener('click', () => this.handlePrinterType('bureautique'));
    }
    
    handlePrinterType(type) {
        const { chatbox } = this.args;
        
        // Clear the buttons and prompt for volume
        const buttonContainer = document.querySelector(".respond_sub");
        if (buttonContainer) buttonContainer.style.display = 'none';
    
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
    
        chatbox.appendChild(createChatListe(`Type d'imprimante sélectionné: ${type}`, "ask"));
        chatbox.appendChild(createBotListe('Merci de préciser le volume quotidien d\'impression.', "respond"));
    
        // Update the description and inputQueue
        this.description += `Type d'imprimante: ${type}. `;
        this.inputQueue = [
            { prompt: 'Volume quotidien:', key: 'volume_impression', handler: this.handleInput.bind(this) }
        ];
        this.requestInput();
    }
    
    handleSwitchChoice() {
        const { chatbox } = this.args;
        this.description = '';
        this.title='Switcher';
        const MainChoice = document.querySelector(".responds");
        if (MainChoice) MainChoice.style.display = 'none';

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

        chatbox.appendChild(createChatListe('Switcher sélectionné', "ask"));
        chatbox.appendChild(createBotListe('Merci de préciser le bureau où le switch sera connecté.', "respond"));
        this.inputQueue = [
            { prompt: 'Bureau:', key: 'bureau_switch', handler: this.handleInput.bind(this) }
        ];
        this.requestInput();
    }

    handleSubChoice(choice) {
        const { chatbox, chatInput,btnreturn,chatSendBtn } = this.args;
        this.description = '';
    
        // Disable chat input
        chatInput.disabled = true;
    
        const initialChoice = document.querySelector(".responds");
        if (initialChoice) initialChoice.style.display = 'none';
    
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
    
        chatbox.appendChild(createChatListe(`${choice} sélectionné`, "ask"));
        
        if (choice === 'Cartouches imprimantes') {
                const searchConsumable = new SearchConsumable(this.args.chatbox, this.args.chatInput, this.args.btnreturn, this.args.chatSendBtn);
                searchConsumable.handleCartoucheChoice();
            } else if (choice === 'Clavier' || choice === 'Souris') {
            chatbox.appendChild(createBotListe('Merci de confirmer votre demande.', "respond"));
            this.description = choice;
            if(choice==='Clavier'){
                this.title="Clavier";
            }
            else{
                this.title="Souris";
                }
            const respondChoice = document.createElement("li");
            respondChoice.classList.add("respond_sub");
            respondChoice.innerHTML = `
                <button id="confirmer" class="chat_send">Confirmer</button>
                <button id="annuler" class="chat_send">Annuler</button>
            `;
            chatbox.appendChild(respondChoice);
    
            // Attach event listeners
            document.getElementById('confirmer')?.addEventListener('click', () => this.handleConfirmation('Confirmer'));
            document.getElementById('annuler')?.addEventListener('click', () => this.handleConfirmation('Annuler'));
        }
    }
     
    createChatListe(message, classname) {
        const chatliste = document.createElement("li");
        chatliste.classList.add("chat", classname);
        chatliste.innerHTML = `<div class="messaget message_client">${message}</div>`;
        return chatliste;
    }

    createBotListe(message, classname) {
        const chatliste = document.createElement("li");
        chatliste.classList.add("chat", classname);
        chatliste.innerHTML = `<div class="messaget message_bot">${message}</div>`;
        return chatliste;
    }
    
    handleConfirmation(response) {
        const initialChoice = document.querySelector(".respond_sub");
        if (initialChoice) initialChoice.style.display = 'none';
        if (response === 'Confirmer') {
            this.createTicket(); 
        } else if (response === 'Annuler') {
            this.addChoices(); 
        }
    }
    
    requestInput() {
        const { chatInput, chatSendBtn } = this.args;
    
        chatInput.disabled = false;
        chatInput.focus();
    
        // Set up the event handler
        this.inputHandler = this.createInputHandler();
    
        // Add the event listener
        chatSendBtn.addEventListener('click', this.inputHandler);
    }
    createInputHandler() {
        return () => {
            const userInput = this.args.chatInput.value.trim();
            if (userInput) {
                this.args.chatInput.value = '';
                this.handleInput(userInput);
                
                // Remove the event listener after handling input
                this.args.chatSendBtn.removeEventListener('click', this.inputHandler);
            }
        };
    }

    handleInput(userInput) {
        const { chatbox } = this.args;

        const currentInput = this.inputQueue.shift();
        if (currentInput) {
            this.inputTable[currentInput.key] = userInput;
            this.description += `${currentInput.prompt} ${userInput}. `;
        }

        chatbox.appendChild(this.createChatListe(userInput, "ask"));

        if (this.inputQueue.length > 0) {
            this.requestInput();
        } else {
            this.createTicket();
        }
    }

    createTicket() {
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

        chatbox.appendChild(createBotListe('Merci pour les informations. Votre ticket est en cours de création...', "respond"));
    
        // Prepare ticket data
        const ticketData = {
            ticket_name: `Demande pour  ${this.title}`, 
            ticket_description: `Demande concernant ${this.description}`,
            type: 2,  // ID for material request
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
                chatbox.innerHTML = ''; 
                chatbox.appendChild(createBotListe(data, "respond"));
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }, 3000);
    }
    

}
