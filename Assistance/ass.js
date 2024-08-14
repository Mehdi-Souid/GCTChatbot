class AssistanceChoice {
    //class for assistance
    constructor(chatbox, chatInput, returnButton) {
        this.args = {
            chatbox: chatbox,
            chatInput: chatInput,
            returnButton: returnButton
        };
        this.initialize();
    }

    initialize() {
        const { returnButton } = this.args;

        // Add an event listener to the return button to refresh the page
        if (returnButton && typeof returnButton.addEventListener === 'function') {
            returnButton.addEventListener('click', () => this.refreshPage());
        } else {
            console.error('Invalid returnButton element or missing addEventListener function');
        }
    }

    refreshPage() {
        // Reload the page to start over
        window.location.reload();
    }

    addChoices() {
        const { chatbox, chatInput } = this.args;

        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = `<div class="messaget message_bot">${message}</div>`;
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

        document.getElementById('Determine_ip').addEventListener('click', () => this.handleDetermineIP());
        document.getElementById('raccourci').addEventListener('click', () => this.handleRaccourci());
        document.getElementById('Dossier_partage').addEventListener('click', () => this.handleDossierPartage());
    }

    handleDetermineIP() {
        const { chatbox } = this.args;
        const createChatListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = `<div class="messaget message_client">${message}</div>`;
            chatliste.innerHTML = chatCont;
            return chatliste;
        };
        chatbox.appendChild(createChatListe("Déterminer l\'adresse IP", "ask"));


        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = `<div class="messaget message_bot">${message}</div>`;
            chatliste.innerHTML = chatCont;
            return chatliste;
        };

        const steps = [
            "1. Ouvrez le menu Démarrer et tapez 'cmd' pour ouvrir l'invite de commandes.",
            "2. Dans l'invite de commandes, tapez 'ipconfig' et appuyez sur Entrée.",
            "3. Recherchez l'adresse IPv4 dans la liste des informations réseau."
        ];

        steps.forEach((step, index) => {
            setTimeout(() => {
                chatbox.appendChild(createBotListe(step, "respond"));
            }, index * 800); // Delay each step slightly
        });

        // Add the button for the YouTube tutorial
        setTimeout(() => {
            const buttonListe = document.createElement("li");
            buttonListe.classList.add("chat", "respond");

            const tutorialButton = document.createElement("button");
            tutorialButton.classList.add("chat_send");
            tutorialButton.innerText = "Voir le tutoriel vidéo";
            tutorialButton.addEventListener('click', () => {
                window.open('https://www.youtube.com/watch?v=tfKm0n0v_4w', '_blank');
            });

            buttonListe.appendChild(tutorialButton);
            chatbox.appendChild(buttonListe);
        }, steps.length * 800);

        // Hide the choice buttons
        const respondChoice = document.querySelector(".respond_choice");
        if (respondChoice) respondChoice.style.display = 'none';

        // Save history
        this.history.push('determine_ip');
    }

    handleRaccourci() {
        const { chatbox } = this.args;
    
        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = `<div class="messaget message_bot">${message}</div>`;
            chatliste.innerHTML = chatCont;
            return chatliste;
        };
    
        const steps = [
            "1. Cliquez avec le bouton droit de la souris sur l'emplacement où vous souhaitez créer le raccourci (par exemple, sur le bureau).",
            "2. Sélectionnez 'Nouveau' puis 'Raccourci'.",
            "3. Entrez le chemin ou l'URL de l'application ou du fichier pour lequel vous souhaitez créer un raccourci.",
            "4. Cliquez sur 'Suivant', donnez un nom au raccourci, puis cliquez sur 'Terminer'."
        ];
    
        steps.forEach((step, index) => {
            setTimeout(() => {
                chatbox.appendChild(createBotListe(step, "respond"));
            }, index * 800); // Delay each step slightly
        });
    
        // Add the button for the YouTube tutorial
        setTimeout(() => {
            const buttonListe = document.createElement("li");
            buttonListe.classList.add("chat", "respond");
    
            const tutorialButton = document.createElement("button");
            tutorialButton.classList.add("chat_send");
            tutorialButton.innerText = "Voir le tutoriel vidéo";
            tutorialButton.addEventListener('click', () => {
                window.open('https://www.youtube.com/watch?v=jcFDyGMFNT8', '_blank');
            });
    
            buttonListe.appendChild(tutorialButton);
            chatbox.appendChild(buttonListe);
        }, steps.length * 800);
    
        // Hide the choice buttons
        const respondChoice = document.querySelector(".respond_choice");
        if (respondChoice) respondChoice.style.display = 'none';
    
        // Save history
        this.history.push('raccourci');
    }
    
    handleDossierPartage() {
        const { chatbox } = this.args;
    
        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = `<div class="messaget message_bot">${message}</div>`;
            chatliste.innerHTML = chatCont;
            return chatliste;
        };
    
        const steps = [
            "1. Créez un nouveau dossier ou utilisez un dossier existant.",
            "2. Faites un clic droit sur le dossier et sélectionnez 'Propriétés'.",
            "3. Allez dans l'onglet 'Partage' et cliquez sur 'Partager...'.",
            "4. Sélectionnez les utilisateurs avec lesquels vous souhaitez partager le dossier, puis cliquez sur 'Partager'.",
            "5. Pour un partage avancé, cliquez sur 'Partage avancé...' et configurez les options supplémentaires."
        ];
    
        steps.forEach((step, index) => {
            setTimeout(() => {
                chatbox.appendChild(createBotListe(step, "respond"));
            }, index * 800); // Delay each step slightly
        });
    
        // Add the button for the YouTube tutorial
        setTimeout(() => {
            const buttonListe = document.createElement("li");
            buttonListe.classList.add("chat", "respond");
    
            const tutorialButton = document.createElement("button");
            tutorialButton.classList.add("chat_send");
            tutorialButton.innerText = "Voir le tutoriel vidéo";
            tutorialButton.addEventListener('click', () => {
                window.open('https://www.youtube.com/watch?v=OLwWjULVB8k', '_blank');
            });
    
            buttonListe.appendChild(tutorialButton);
            chatbox.appendChild(buttonListe);
        }, steps.length * 800);
    
        // Hide the choice buttons
        const respondChoice = document.querySelector(".respond_choice");
        if (respondChoice) respondChoice.style.display = 'none';
    
        // Save history
        this.history.push('dossier_partage');
    }
    

    returnToPreviousLevel() {
        const { chatbox } = this.args;

        const respondChoice = document.querySelector(".respond_choice");
        if (respondChoice) respondChoice.style.display = 'none';

        chatbox.innerHTML = '';

        const previousLevel = this.history.pop();
        if (previousLevel === 'assistance') {
            this.addChoices(); 
        } else if (previousLevel === 'determine_ip') {
            this.addChoices(); 
        }
    }
}
