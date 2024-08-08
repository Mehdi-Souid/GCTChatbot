class AutoRespond {
    constructor(buttons, chatbox, chatInput, btnreturn) {
        this.args = {
            buttons: buttons,
            chatbox: chatbox,
            chatInput: chatInput,
            btnreturn: btnreturn
        };
        this.history = []; //  navigation history
        this.initialize();
    }

    initialize() {
        const { buttons, chatbox, chatInput, btnreturn } = this.args;

        const handleChat = (event) => {
            const buttonId = event.target.id;
            let userMessage;
            let botResponse;

            // previous choice before changing
            this.history.push(buttonId);

            if (buttonId === 'reparer') {
                userMessage = 'Réparation matériel';
                buttons.forEach(button => button.style.display = 'none');
                const messageAdd = new MessageRespond(chatInput, chatbox);
                messageAdd.addMessage(userMessage, botResponse);
                const repare = new ReparationChoice(chatbox, chatInput);
                repare.addChoices();
            } else if (buttonId === 'configuration') {
                userMessage = 'Configuration logiciel';
                buttons.forEach(button => button.style.display = 'none');
                const messageAdd = new MessageRespond(chatInput, chatbox);
                messageAdd.addMessage(userMessage, botResponse);
                const config = new ConfigurationChoice(chatbox, chatInput);
                config.addChoices();
            } else if (buttonId === 'demande') {
                userMessage = 'Demande matériel';
                buttons.forEach(button => button.style.display = 'none');
                const messageAdd = new MessageRespond(chatInput, chatbox);
                messageAdd.addMessage(userMessage, botResponse);
                const demande = new DemandeChoice(chatbox, chatInput);
                demande.addChoices();
            } else if (buttonId === 'acces') {
                userMessage = 'Demande Accès';
                buttons.forEach(button => button.style.display = 'none');
                const messageAdd = new MessageRespond(chatInput, chatbox);
                messageAdd.addMessage(userMessage, botResponse);
                const acces = new AccesChoice(chatbox, chatInput);
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
            btnreturn.addEventListener('click', () => this.returnToPreviousLevel());
        } else {
            console.error('Invalid btnreturn element or missing addEventListener function');
        }
    }

    returnToPreviousLevel() {
        const { chatbox } = this.args;

        const respondChoice = document.querySelector(".respond_choice");
        if (respondChoice) respondChoice.style.display = 'none';

        chatbox.innerHTML = '';

        // Pop the history 
        const previousLevel = this.history.pop();

        switch (previousLevel) {
            case 'reparer':
                this.addReparationChoices();
                break;
            case 'configuration':
                this.addConfigurationChoices();
                break;
            case 'demande':
                this.addDemandeChoices();
                break;
            case 'acces':
                this.addAccesChoices();
                break;
            case 'asistance':
                this.addAssistanceChoices();
                break;
            default:
                console.log('No previous level found');
        }
    }

    // Methods add choices 
    addReparationChoices() {
        const { chatbox } = this.args;
        const messageAdd = new MessageRespond(this.args.chatInput, chatbox);
        messageAdd.addMessage('Réparation matériel', '');
        const repare = new ReparationChoice(chatbox, this.args.chatInput);
        repare.addChoices();
    }

    addConfigurationChoices() {
        const { chatbox } = this.args;
        const messageAdd = new MessageRespond(this.args.chatInput, chatbox);
        messageAdd.addMessage('Configuration logiciel', '');
        const config = new ConfigurationChoice(chatbox, this.args.chatInput);
        config.addChoices();
    }

    addDemandeChoices() {
        const { chatbox } = this.args;
        const messageAdd = new MessageRespond(this.args.chatInput, chatbox);
        messageAdd.addMessage('Demande matériel', '');
        const demande = new DemandeChoice(chatbox, this.args.chatInput);
        demande.addChoices();
    }

    addAccesChoices() {
        const { chatbox } = this.args;
        const messageAdd = new MessageRespond(this.args.chatInput, chatbox);
        messageAdd.addMessage('Demande Accès', '');
        const acces = new AccesChoice(chatbox, this.args.chatInput);
        acces.addChoices();
    }

    addAssistanceChoices() {
        const { chatbox } = this.args;
        const messageAdd = new MessageRespond(this.args.chatInput, chatbox);
        messageAdd.addMessage('Assistance', '');
        const assist = new AssistanceChoice(chatbox, this.args.chatInput, this.args.btnreturn);
        assist.addChoices();
    }
}
