class AutoRespond {
    constructor(chatbox, chatInput, btnreturn, chatsendbtn) {
        this.args = {
            chatbox: chatbox,
            chatInput: chatInput,
            btnreturn: btnreturn,
            chatsendbtn: chatsendbtn
        };
        this.initialize();
    }

    initialize() {
        const { chatbox,chatInput,btnreturn,chatsendbtn } = this.args;
        chatsendbtn.style.display = 'block';
        btnreturn.style.display = 'block';
        chatInput.disabled = false;
        
        chatsendbtn.removeEventListener('click', this.handleSendClick);
        btnreturn.removeEventListener('click', this.handleReturnClick);
        this.addMainChoices();

        this.args.chatbox.addEventListener('click', this.handleChat.bind(this));
    }

    handleChat(event) {
        const target = event.target;
        const buttonId = target.id;

        let userMessage;
        let choiceInstance;

        switch (buttonId) {
            case 'reparer':
                userMessage = 'Réparation matériel';
                this.processChoice(userMessage);
                const rep = new ReparationChoice(this.args.chatbox, this.args.chatInput, this.args.btnreturn,this.args.chatsendbtn);
                break;
            case 'configuration':
                userMessage = 'Configuration logiciel';
                this.processChoice(userMessage);
                const config = new ConfigurationChoice(this.args.chatbox, this.args.chatInput, this.args.btnreturn,this.args.chatsendbtn);
                break;
            case 'demande':
                userMessage = 'Demande matériel';
                this.processChoice(userMessage);
                const demande = new DemandeChoice(this.args.chatbox, this.args.chatInput, this.args.btnreturn, this.args.chatsendbtn);
                break;
            case 'acces':
                userMessage = 'Demande Accès';
                this.processChoice(userMessage);
                const access = new AccessChoice(this.args.chatbox, this.args.chatInput, this.args.btnreturn, this.args.chatsendbtn);
                break;
            case 'asistance':
                userMessage = 'Assistance';
                this.processAssistanceChoice(userMessage);
                return; 
            default:
                console.log('Unknown button clicked:', buttonId);
                return; 
        }

    }
   
    processAssistanceChoice(userMessage) {
         this.hideMainChoices();
        const messageAdd = new MessageRespond(this.args.chatInput, this.args.chatbox);
        messageAdd.addMessage(userMessage);
        const assist = new AssistanceChoice(this.args.chatbox, this.args.chatInput, this.args.btnreturn, this.args.chatsendbtn);
    }

    processChoice(userMessage, choiceInstance) {
        this.hideMainChoices();
        const messageAdd = new MessageRespond(this.args.chatInput, this.args.chatbox);
        messageAdd.addMessage(userMessage);
    }

    addMainChoices() {
        const { chatbox } = this.args;
        chatbox.innerHTML = `
            <li class="respond_choice">
                <button id="reparer" class="chat_send">Réparation matériel</button>
                <button id="configuration" class="chat_send">Configuration logiciel</button>
                <button id="demande" class="chat_send">Demande matériel</button>
                <button id="acces" class="chat_send">Demande Accès</button>
                <button id="asistance" class="chat_send">Assistance</button>
            </li>
        `;
    }

    hideMainChoices() {
        const { chatbox } = this.args;
        chatbox.innerHTML = ''; // Clear main choices
    }
}
