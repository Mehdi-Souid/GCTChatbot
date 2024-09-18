document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.querySelector('.chat_input');
    const sendBtn = document.querySelector('.button_send');
    const chatList = document.querySelector('.chat');
    const returnButton = document.querySelector(".button_return");

    const autoRespond = new AutoRespond(chatList, chatInput, returnButton, sendBtn);

});
