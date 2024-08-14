//main class app
document.addEventListener("DOMContentLoaded", () => {
    const chatButton = document.querySelector('.ButtonOpenAndClose');
    const chatContent = document.querySelector('.chatbox__support');
    const chatInput = document.querySelector('.chat_input');
    const Sendbtn = document.querySelector('.button_send');
    const chatList = document.querySelector('.chat');
    const buttons = document.querySelectorAll(".chat_send");
    const returnButton = document.querySelector(".button_return");
    const icons = {
        isClicked: '<img src="./images/chatbox-icon.svg" />',
        isNotClicked: '<img src="./images/chatbox-icon.svg" />'
    };

    const interactiveChatbox = new InteractiveChatbox(chatButton, chatContent, icons);
    interactiveChatbox.display();
    interactiveChatbox.toggleIcon(false, chatButton);
;


    const autoRespond = new AutoRespond(buttons, chatList, chatInput, returnButton,Sendbtn);
});
