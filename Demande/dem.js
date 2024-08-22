class DemandeChoice {
    //class for option demande materials
    constructor(chatbox, chatInput,btnreturn, chatSendBtn) {
        this.args = {
            chatbox: chatbox,
            chatInput: chatInput,
            chatSendBtn: chatSendBtn,
            btnreturn:btnreturn
        };
        this.selectedChoice = null; // Track the selected sub-choice
        this.searchConsumable = new SearchConsumable(chatbox);
        this.searchPc = new SearchPc(chatbox);
        this.searchSwitcher = new SearchSwitcher(chatbox);
        this.searchPrinter = new SearchPrinter(chatbox);
        // Disable the chat input field initially
        this.args.chatInput.disabled = true;

    }

    addChoices() {
        const { chatbox } = this.args;

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
    }

    handleSubChoice(choice) {
        const { chatbox, chatInput } = this.args;

        const createChatListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            let chatCont = `<div class="messaget message_client">${message}</div>`;
            chatliste.innerHTML = chatCont;
            return chatliste;
        };
        chatbox.appendChild(createChatListe(choice, "ask"));

        // Store the selected sub-choice for later use
        this.selectedChoice = choice;

        chatbox.appendChild(this.searchConsumable.createBotListe('Veuillez entrer le nom du matériel dans le champ de saisie et cliquer sur envoyer.', "respond"));
chatInput.disabled = false; // Enable the chat input field

const subChoiceBtns = document.querySelector(".responds");
if (subChoiceBtns) subChoiceBtns.style.display = 'none';

chatSendBtn.addEventListener('click', () => {
    const materialName = chatInput.value.trim();
    if (materialName) {
        switch (this.selectedChoice) {
            case 'Souris':
            case 'Cartouches imprimantes':
            case 'Clavier':
                this.searchConsumable.handleChatSendClick(materialName, this.selectedChoice);
                break;
            case 'Ordinateur':
                this.searchPc.handleChatSendClick(materialName, this.selectedChoice);
                break;
            case 'Imprimante':
                this.searchPrinter.handleChatSendClick(materialName, this.selectedChoice);
                break;
            case 'Switcher':
                this.searchSwitcher.handleChatSendClick(materialName, this.selectedChoice);
                break;
        }
        chatInput.value = '';
        chatInput.disabled = true;
    } else {
        this.searchConsumable.createBotListe('Veuillez entrer le nom du matériel dans le champ de saisie.', "respond");
    }
});

    }
}
