class ConfigurationChoice {
    //class for configuration option
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
        const { chatInput, btnreturn, chatsendbtn } = this.args;
        this.addChoices('main'); 

        this.setupReturnButtonListener();

        chatInput.disabled = true;
        chatsendbtn.style.display = 'none';
    }

    setupReturnButtonListener() {
        const { btnreturn } = this.args;

        btnreturn.removeEventListener('click', this.handleReturnButton.bind(this));

        btnreturn.addEventListener('click', () => this.handleReturnButton());
    }

    handleReturnButton() {
        const { chatbox, chatInput, chatsendbtn } = this.args;

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
        userMessage = 'Configuration Logiciel';
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

            chatbox.appendChild(createBotListe('Quel problème souhaitez-vous configurer?', "respond"));

            const respondChoice = document.createElement("li");
            respondChoice.classList.add("respond_choice");
            respondChoice.innerHTML = `
                <button id="ivara" class="chat_send">iVARA</button>
                <button id="si" class="chat_send">SI</button>
                <button id="si_web" class="chat_send">SI Web</button>
            `;
            chatbox.appendChild(respondChoice);

            document.getElementById('ivara').addEventListener('click', () => this.handleIVARA());
            document.getElementById('si').addEventListener('click', () => this.handleChoice('SI'));
            document.getElementById('si_web').addEventListener('click', () => this.handleChoice('SI Web'));
        }
    }

    handleIVARA() {
        const { chatbox } = this.args;
    
        this.currentState = 'sub'; // Switch to sub-state
    
        const initialChoice = document.querySelector(".respond_choice");
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
        chatbox.appendChild(createChatListe('IVARA', "ask"));
    
        chatbox.appendChild(createBotListe('Quel problème avec iVARA?', "respond"));
    
        const respondChoice = document.createElement("li");
        respondChoice.classList.add("respond_choice");
        respondChoice.innerHTML = `
            <button id="ivara_start" class="chat_send">Problème démarrage</button>
            <button id="ivara_print" class="chat_send">Impression Ivara</button>
        `;
        chatbox.appendChild(respondChoice);
    
        // Get all buttons within the respond_choice container
        const buttons = respondChoice.querySelectorAll('button');
    
        // Add event listeners to each button
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                this.handleChoice(event.target.textContent);
                
                // Hide all buttons
                buttons.forEach(btn => btn.style.display = 'none');
            });
        });
    }
    
    handleChoice(choice) {
        const { chatbox, chatInput, chatsendbtn } = this.args;
        const initialChoice = document.querySelector(".respond_choice");
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
    
        chatbox.appendChild(createChatListe(choice, "ask"));
    
        let detailsMessage;
        if (choice === 'Problème démarrage') {
            detailsMessage = "merci d'indiquer l'adresse ip de la machine où vous ne pourriez pas l'accéder a si vous disposez déjà d'un compte ivara opérationnel.";
        } else if (choice === 'Impression Ivara') {
            detailsMessage = "merci d'indiquer l'adresse ip de la machine où vous ne pourriez pas assurer l'impression ivara.";
        } else if (choice === 'SI') {
            detailsMessage = "merci de préciser l'erreur affichée ainsi que l'adresse IP .";
        } else if (choice === 'SI Web') {
            detailsMessage = "merci de préciser l'erreur affichée ainsi que l'adresse IP .";
        }
        
        chatbox.appendChild(createBotListe(`Vous avez choisi ${choice}. ${detailsMessage}`, "respond"));
    
        chatInput.disabled = false;
        chatsendbtn.style.display = 'inline-block';
    
        // Handle ticket creation
        chatsendbtn.addEventListener('click', () => this.createTicket(choice, chatInput.value));
    }
    

    createTicket(issueType, description) {
        
        const { chatbox,chatInput } = this.args;
        chatbox.innerHTML="";
        chatInput.value = ''; 

        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            chatliste.innerHTML = `<div class="messaget message_bot">${message}</div>`;
            return chatliste;
        };

        chatbox.appendChild(createBotListe(`Votre ticket pour ${issueType} est en cours de création. Veuillez patienter.`, "respond"));

        // Prepare ticket data
        const ticketData = {
            //password and username(old) 
            ticket_name: `Probleme de ${issueType}`, 
            ticket_description: `Addresse ip de machine ${description} `,
            type: 1,  // ID for incident
            category: 1  // Default category ID
        };
        setTimeout(() => {
            // Code to execute after 3 seconds
        
        
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
            chatbox.appendChild(createBotListe(data, "respond"));
        })
        .catch(error => {
            console.error('Error:', error);
        });

    }, 3000);
    }
}
