class AutoRespond {
    //class for main multiple choices
    constructor(buttons, chatbox, chatInput, btnreturn, chatsendbtn) {
        this.args = {
            buttons: buttons,
            chatbox: chatbox,
            chatInput: chatInput,
            btnreturn: btnreturn,
            chatsendbtn: chatsendbtn
        };
        this.history = []; // Navigation history
        this.initialize();
    }

    initialize() {
        const { buttons, chatbox, chatInput, btnreturn, chatsendbtn } = this.args;

        const handleChat = (event) => {
            const buttonId = event.target.id;
            let userMessage;
            let botResponse;

            // Store the previous choice before changing
            this.history.push(buttonId);

            if (buttonId === 'reparer') {
                userMessage = 'Réparation matériel';
                buttons.forEach(button => button.style.display = 'none');
                const messageAdd = new MessageRespond(chatInput, chatbox);
                messageAdd.addMessage(userMessage, botResponse);
                const repare = new ReparationChoice(chatbox, chatInput, btnreturn);
                repare.addChoices();
            } else if (buttonId === 'configuration') {
                userMessage = 'Configuration logiciel';
                buttons.forEach(button => button.style.display = 'none');
                const messageAdd = new MessageRespond(chatInput, chatbox);
                messageAdd.addMessage(userMessage, botResponse);
                const config = new ConfigurationChoice(chatbox, chatInput, btnreturn);
                config.addChoices();
            } else if (buttonId === 'demande') {
                userMessage = 'Demande matériel';
                buttons.forEach(button => button.style.display = 'none');
                const messageAdd = new MessageRespond(chatInput, chatbox);
                messageAdd.addMessage(userMessage, botResponse);
                const demande = new DemandeChoice(chatbox, chatInput, btnreturn, chatsendbtn);
                demande.addChoices();
            } else if (buttonId === 'acces') {
                userMessage = 'Demande Accès';
                buttons.forEach(button => button.style.display = 'none');
                const messageAdd = new MessageRespond(chatInput, chatbox);
                messageAdd.addMessage(userMessage, botResponse);
                const acces = new AccesChoice(buttons, chatbox, chatInput, btnreturn, chatsendbtn);
                acces.addChoices();
            } else if (buttonId === 'asistance') {
                userMessage = 'Assistance';
                buttons.forEach(button => button.style.display = 'none');
                const messageAdd = new MessageRespond(chatInput, chatbox);
                messageAdd.addMessage(userMessage, botResponse);
                const assist = new AssistanceChoice(chatbox, chatInput, btnreturn);
                assist.addChoices();
            }

            buttons.forEach(button => button.style.display = 'none');
        };

        buttons.forEach(button => {
            button.addEventListener("click", handleChat);
        });

        // Set up the return button 
        if (btnreturn && typeof btnreturn.addEventListener === 'function') {
            btnreturn.addEventListener('click', () => {
                const previousLevel = this.history.pop();

                if (previousLevel) {
                    switch (previousLevel) {
                        case 'reparer':
                            this.addReparationChoices(btnreturn);
                            break;
                        case 'configuration':
                            this.addConfigurationChoices(btnreturn);
                            break;
                        case 'demande':
                            this.addDemandeChoices(btnreturn);
                            break;
                        case 'acces':
                            this.addAccesChoices(btnreturn);
                            break;
                        case 'asistance':
                            this.addAssistanceChoices(btnreturn);
                            break;
                        default:
                            console.log('No previous level found');
                    }
                }
            });
        } else {
            console.error('Invalid btnreturn element or missing addEventListener function');
        }
    }

    // Methods to add choices with btnreturn as a parameter
    addReparationChoices(btnreturn) {
        const { chatbox } = this.args;
        const messageAdd = new MessageRespond(this.args.chatInput, chatbox);
        messageAdd.addMessage('Réparation matériel', '');
        const repare = new ReparationChoice(chatbox, this.args.chatInput, btnreturn);
        repare.addChoices();
    }

    addConfigurationChoices(btnreturn) {
        const { chatbox } = this.args;
        const messageAdd = new MessageRespond(this.args.chatInput, chatbox);
        messageAdd.addMessage('Configuration logiciel', '');
        const config = new ConfigurationChoice(chatbox, this.args.chatInput, btnreturn);
        config.addChoices();
    }

    addDemandeChoices(btnreturn) {
        const { chatbox, chatsendbtn } = this.args;
        const messageAdd = new MessageRespond(this.args.chatInput, chatbox);
        messageAdd.addMessage('Demande matériel', '');
        const demande = new DemandeChoice(chatbox, this.args.chatInput, btnreturn, chatsendbtn);
        demande.addChoices();
    }

    addAccesChoices(btnreturn) {
        const { buttons, chatbox, chatInput, chatsendbtn } = this.args;
        const messageAdd = new MessageRespond(this.args.chatInput, chatbox);
        messageAdd.addMessage('Demande Accès', '');
        const acces = new AccesChoice(buttons, chatbox, chatInput, btnreturn, chatsendbtn);
        acces.addChoices();
    }

    addAssistanceChoices(btnreturn) {
        const { buttons, chatbox, chatInput, chatsendbtn } = this.args;
        const messageAdd = new MessageRespond(this.args.chatInput, chatbox);
        messageAdd.addMessage('Assistance', '');
        const assist = new AssistanceChoice(chatbox, chatInput, btnreturn);
        assist.addChoices();
    }
}
