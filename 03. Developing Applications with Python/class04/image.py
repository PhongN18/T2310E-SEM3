import tkinter as tk
from PIL import Image, ImageTk
# Tạo cửa sổ giao diện
root = tk.Tk()
root.title("Hiển thị Ảnh trong Python")
# Mơ ̉ và xử lý ảnh
image_path = "example.jpg"  # Thay bằng đường dẫn ảnh của bạn
image = Image.open(image_path)
image = image.resize((300, 300))  # Tùy chỉnh kích thước
# Chuyển đổi ảnh sang định dạng Tkinter
photo = ImageTk.PhotoImage(image)
# Tạo Label để ̉hiển thị ảnh
label = tk.Label(root, image=photo)
label.pack()
# Chạy vòng lặp Tkinter
root.mainloop()