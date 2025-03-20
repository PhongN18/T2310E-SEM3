import socket
import tkinter as tk
from threading import Thread

# Send message
def send_message():
    message = entry.get()
    if message:
        client_socket.send(message.encode())
        text_area.insert(tk.END, "You: " + message + "\n")
        entry.delete(0, tk.END)
        
# Receive message from server
def receive_messages():
    while True:
        try:
            response = client_socket.recv(10244).decode()
            text_area.insert(tk.END, "Server: " + response + "\n")
        except:
            break

# Configure socket client
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
host = '127.0.0.1'
port = 12345
client_socket.connect((host, port))

# Tkinter GUI
window = tk.Tk()
window.title("Chat Client")

text_area = tk.Text(window, height=10, width=50)
text_area.pack(pady=10)

entry = tk.Entry(window, width=40)
entry.pack(pady=5)

send_button = tk.Button(window, text="Send", command=send_message)
send_button.pack(pady=5)

# Initialize receive-message thread
receive_thread = Thread(target=receive_messages)
receive_thread.daemon = True
receive_thread.start()

# Run client UI
window.mainloop()

# Close connection
client_socket.close()