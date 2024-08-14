class SearchPc{
    constructor(chatbox) {
        this.chatbox = chatbox;
    }

    createChatListe(message, classname) {
        const chatliste = document.createElement("li");
        chatliste.classList.add("chat", classname);
        let chatCont = `<div class="messaget message_client">${message}</div>`;
        chatliste.innerHTML = chatCont;
        return chatliste;
    }

    createBotListe(message, classname) {
        const chatliste = document.createElement("li");
        chatliste.classList.add("chat", classname);
        let chatCont = `<div class="messaget message_bot">${message}</div>`;
        chatliste.innerHTML = chatCont;
        return chatliste;
    }

    searchMaterial(materialName) {
        return fetch('check_computer.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'material_name': materialName
            })
        })
        .then(response => response.json());
    }

    handleChatSendClick(materialName, selectedChoice) {
        this.chatbox.appendChild(this.createChatListe(`Choix : ${materialName}`, "ask"));

        this.searchMaterial(materialName)
            .then(data => {
                if (data.available) {
                    this.chatbox.appendChild(this.createBotListe('Le matériel demandé est disponible.', "respond"));
                } else {
                    this.chatbox.appendChild(this.createBotListe('Le matériel demandé n\'est pas disponible.', "respond"));
                }
            })
            .catch(error => {
                console.error('Error checking material availability:', error);
                this.chatbox.appendChild(this.createBotListe('Une erreur est survenue lors de la vérification de la disponibilité.', "respond"));
            });
    }
}