import socket

# Configuring server
host = '127.0.0.1' # IP address (localhost)
port = 12345
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Bind and listen
server_socket.bind((host, port))
server_socket.listen(1)

print(f"Server is listening at {host}:{port}")

# Accepting connection from client
client_socket, addr = server_socket.accept()
print(f"Connection from {addr}")

# Loop for receiving and sending messages
while True:
    data = client_socket.recv(1024).decode()
    if not data:
        break
    print(f"Client sent: {data}")
    if data == 'Hello':
        client_socket.send("Hello from Server!".encode())
    else:
        client_socket.send("Message received!".encode())
    
# Close connection
client_socket.close()
server_socket.close()