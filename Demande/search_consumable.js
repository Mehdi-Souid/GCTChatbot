class SearchConsumable {
    constructor(chatbox, chatInput, btnreturn, chatSendBtn) {
        this.args = {
            chatbox: chatbox,
            chatInput: chatInput,
            chatSendBtn: chatSendBtn,
            btnreturn: btnreturn,
        };
        this.description = '';
        this.handleSendClick = this.handleSendClick.bind(this); // Bind the method
    }

    // Method to handle search for a consumable
    handleCartoucheChoice() {
        const { chatbox, chatInput, chatSendBtn } = this.args;
        this.description = '';
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

        chatbox.appendChild(createBotListe('Merci de préciser le nom du cartouche.', "respond"));

        chatInput.disabled = false;
        chatSendBtn.disabled = false;

        // Handle send button click for cartouche name
        chatSendBtn.addEventListener('click', this.handleSendClick);
    }

    handleSendClick() {
        const { chatbox, chatInput, chatSendBtn } = this.args;
        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            chatliste.innerHTML = `<div class="messaget message_bot">${message}</div>`;
            return chatliste;
        };
        const createChatListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            chatliste.innerHTML = `<div class="messaget message_client">${message}</div>`;
            return chatliste;
        };
        const cartoucheName = chatInput.value.trim();
        if (cartoucheName) {
            chatbox.appendChild(createChatListe(`Recherche pour le cartouche: ${cartoucheName}`, "ask"));
            chatInput.disabled = true;
            chatSendBtn.disabled = true;

            this.searchMaterial(cartoucheName)
                .then(available => {
                    console.log(available);
                    if (available) {
                        chatbox.appendChild(createBotListe('Le cartouche demandé est disponible. Merci de confirmer.', "respond"));

                        this.description += `Cartouche: ${cartoucheName}. `;
                        const respondChoice = document.createElement("li");
                        respondChoice.classList.add("respond_sub");
                        respondChoice.innerHTML = `
                            <button id="confirmer" class="chat_send">Confirmer</button>
                            <button id="annuler" class="chat_send">Annuler</button>
                        `;
                        chatbox.appendChild(respondChoice);

                        document.getElementById('confirmer')?.addEventListener('click', () => this.ConfimrationChoice(cartoucheName));
                        document.getElementById('annuler')?.addEventListener('click', () => this.CancelChoice());
                    } else {
                        chatbox.appendChild(createBotListe('Le cartouche demandé n\'est pas disponible. Retournez au menu principal.', "respond"));
                    }
                })
                .catch(error => {
                    console.error('Error checking cartouche availability:', error);
                    chatbox.appendChild(createBotListe('Une erreur est survenue lors de la vérification de la disponibilité.', "respond"));
                });

            chatInput.value = '';
        } else {
            chatbox.appendChild(createBotListe('Veuillez entrer le nom du cartouche.', "respond"));
        }
    }

    CancelChoice() {
        const { chatbox, chatInput, chatSendBtn, btnreturn } = this.args;
        chatSendBtn.removeEventListener('click', this.handleSendClick);
        chatInput.disabled = true;
        chatSendBtn.disabled = true;
        new DemandeChoice(chatbox, chatInput, btnreturn, chatSendBtn);
    }

    ConfimrationChoice(cartoucheName) {
        const { chatbox, chatInput, chatSendBtn } = this.args;

        const initialChoice = document.querySelector(".respond_sub");
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

        chatbox.appendChild(createChatListe('Confirmer cartouche: ' + cartoucheName, "ask"));
        chatbox.appendChild(createBotListe('Merci, votre demande a été prise en compte.', "respond"));

        this.description += `Cartouche: ${cartoucheName}.`;

        // Create the ticket
        this.createTicket(cartoucheName);

        // Reset input and buttons
        chatInput.disabled = true;
        chatSendBtn.disabled = true;
    }

    // Method to search for material
    searchMaterial(materialName) {
        return fetch('check_material.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'material_name': materialName
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Search result data:', data); // Log the data received
            return data.available === true; // Check if `available` is true
        })
        .catch(error => {
            console.error('Error checking cartouche availability:', error);
            return false; // Return false if there's an error
        });
    }
    

    // Method to create a ticket
    createTicket(cartoucheName) {
        const { chatbox, chatInput, btnreturn, chatSendBtn } = this.args;

        // Clear chatbox and display initial message
        chatbox.innerHTML = '';
        const createBotListe = (message, classname) => {
            const chatliste = document.createElement("li");
            chatliste.classList.add("chat", classname);
            chatliste.innerHTML = `<div class="messaget message_bot">${message}</div>`;
            return chatliste;
        };

        chatbox.appendChild(createBotListe(`Création du ticket pour le cartouche ${cartoucheName} en cours. Veuillez patienter.`, "respond"));

        // Prepare data for ticket creation
        const ticketData = {
            ticket_name: `Demande pour cartouche ${cartoucheName}`,
            ticket_description: `Demande concernant le cartouche: ${cartoucheName}`,
            type: 1,
            category: 1
        };

        // Simulate ticket creation process with a delay
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
                chatbox.appendChild(createBotListe('Le ticket a été créé avec succès. Merci!', "respond"));

                // Delay before returning to the main menu
                setTimeout(() => {
                    new AutoRespond(chatbox, chatInput, btnreturn, chatSendBtn); // Instantiate AutoRespond to return to the main menu
                }, 3000);
            })
            .catch(error => {
                console.error('Error creating ticket:', error);
                chatbox.appendChild(createBotListe('Une erreur est survenue lors de la création du ticket.', "respond"));

                // Delay before returning to the main menu
                setTimeout(() => {
                    new AutoRespond(chatbox, chatInput, btnreturn, chatSendBtn); // Instantiate AutoRespond to return to the main menu
                }, 3000);
            });
        }, 3000); // Simulate a delay for ticket creation
    }
}
