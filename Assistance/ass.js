class AssistanceChoice {
    //class for assitance
    constructor(chatbox, chatInput, btnreturn, chatsendbtn) {
        this.args = {
            chatbox: chatbox,
            chatInput: chatInput,
            btnreturn: btnreturn,
            chatsendbtn: chatsendbtn
        };
        this.history = [];
        this.currentState = 'main'; // Track the current state
        this.initialize();
    }

    initialize() {
        const { chatbox, chatInput, btnreturn } = this.args;
        
        this.addChoices('main'); 

        this.setupReturnButtonListener();
    }

    setupReturnButtonListener() {
        const { btnreturn } = this.args;

        btnreturn.removeEventListener('click', this.handleReturnButton.bind(this));
        
        btnreturn.addEventListener('click', () => this.handleReturnButton());
    }

    handleReturnButton() {
        const { chatbox, chatInput, btnreturn } = this.args;
        
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
        userMessage = 'Assistance';
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

            chatbox.appendChild(createBotListe('Veuillez sélectionner le type d\'assistance que vous souhaitez demander:', "respond"));

            const respondChoice = document.createElement("li");
            respondChoice.classList.add("respond_choice");
            respondChoice.innerHTML = `
                <button id="Determine_ip" class="chat_send">Déterminer l'adresse IP</button>
                <button id="raccourci" class="chat_send">Créer un raccourci</button>
                <button id="Dossier_partage" class="chat_send">Créer un dossier de partage</button>
            `;
            chatbox.appendChild(respondChoice);

            document.getElementById('Determine_ip').addEventListener('click', () => this.handleDetermineIP());
            document.getElementById('raccourci').addEventListener('click', () => this.handleRaccourci());
            document.getElementById('Dossier_partage').addEventListener('click', () => this.handleDossierPartage());
        } else if (state === 'sub') {
            this.currentState = 'sub'; // Update state to sub
        }
    }

    handleDetermineIP() {
        this.currentState = 'sub';
        this.history.push('determine_ip');
        this.addChatSteps(
            ["1. Ouvrez le menu Démarrer et tapez 'cmd' pour ouvrir l'invite de commandes.",
            "2. Dans l'invite de commandes, tapez 'ipconfig' et appuyez sur Entrée.",
            "3. Recherchez l'adresse IPv4 dans la liste des informations réseau."],
            'https://www.youtube.com/watch?v=tfKm0n0v_4w'
        );
        this.hideChoices();
    }

    handleRaccourci() {
        this.currentState = 'sub';
        this.history.push('raccourci');
        this.addChatSteps(
            ["1. Cliquez avec le bouton droit de la souris sur l'emplacement où vous souhaitez créer le raccourci (par exemple, sur le bureau).",
            "2. Sélectionnez 'Nouveau' puis 'Raccourci'.",
            "3. Entrez le chemin ou l'URL de l'application ou du fichier pour lequel vous souhaitez créer un raccourci.",
            "4. Cliquez sur 'Suivant', donnez un nom au raccourci, puis cliquez sur 'Terminer'."],
            'https://www.youtube.com/watch?v=jcFDyGMFNT8'
        );
        this.hideChoices();
    }

    handleDossierPartage() {
        this.currentState = 'sub';
        this.history.push('dossier_partage');
        this.addChatSteps(
            ["1. Créez un nouveau dossier ou utilisez un dossier existant.",
            "2. Faites un clic droit sur le dossier et sélectionnez 'Propriétés'.",
            "3. Allez dans l'onglet 'Partage' et cliquez sur 'Partager...'.",
            "4. Sélectionnez les utilisateurs avec lesquels vous souhaitez partager le dossier, puis cliquez sur 'Partager'.",
            "5. Pour un partage avancé, cliquez sur 'Partage avancé...' et configurez les options supplémentaires."],
            'https://www.youtube.com/watch?v=OLwWjULVB8k'
        );
        this.hideChoices();
    }

    addChatSteps(steps, tutorialUrl) {
        const { chatbox } = this.args;

        const createBotElement = (message, classname) => {
            const chatElement = document.createElement("li");
            chatElement.classList.add("chat", classname);
            chatElement.innerHTML = `<div class="messaget message_bot">${message}</div>`;
            return chatElement;
        };

        steps.forEach((step, index) => {
            setTimeout(() => {
                chatbox.appendChild(createBotElement(step, "respond"));
            }, index * 800); 
        });

        setTimeout(() => {
            const buttonElement = document.createElement("li");
            buttonElement.classList.add("chat", "respond");

            const tutorialButton = document.createElement("button");
            tutorialButton.classList.add("chat_send");
            tutorialButton.innerText = "Voir le tutoriel vidéo";
            tutorialButton.addEventListener('click', () => {
                window.open(tutorialUrl, '_blank');
            });

            buttonElement.appendChild(tutorialButton);
            chatbox.appendChild(buttonElement);
        }, steps.length * 800);
    }

    hideChoices() {
        const respondChoice = document.querySelector(".respond_choice");
        if (respondChoice) respondChoice.style.display = 'none';
    }
}
