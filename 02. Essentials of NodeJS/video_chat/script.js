const peer = new Peer();
const socket = io("http://localhost:3001");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;
const chatInput = document.getElementById("chat-input");
const sendChatButton = document.getElementById("send-chat");
const chatMessages = document.getElementById("chat-messages");

// Get user media (video/audio)
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then((stream) => {
    myVideo.srcObject = stream;
    myVideo.play();
    videoGrid.append(myVideo);

    peer.on("open", (id) => {
        socket.emit("join-room", "room1", id);
    });
});

// Send chat message when the button is clicked
sendChatButton.addEventListener("click", () => {
    const message = chatInput.value;
    if (message.trim() !== "") {
        socket.emit("send-message", message); // Send message to server
        displayMessage("Me: " + message); // Display message in chat
        chatInput.value = ""; // Clear the input field
    }
});

// Display received message in the chat
socket.on("receive-message", (message) => {
    displayMessage(message); // Display the message from other users
});

// Function to display messages in the chat box
function displayMessage(message) {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
}
