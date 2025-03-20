import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import os

class AddBookWindow:
    def __init__(self, parent, controller):
        self.controller = controller
        self.window = tk.Toplevel(parent)
        self.window.title("Add New Book")
        self.window.geometry("300x250")

        tk.Label(self.window, text="Title").pack()
        self.title_entry = tk.Entry(self.window)
        self.title_entry.pack()

        tk.Label(self.window, text="Author").pack()
        self.author_entry = tk.Entry(self.window)
        self.author_entry.pack()

        tk.Label(self.window, text="Genre").pack()

        # Lấy danh sách thể loại từ thư mục images/genres
        self.genre_options = self.load_genres()
        self.genre_var = tk.StringVar()
        self.genre_dropdown = ttk.Combobox(self.window, textvariable=self.genre_var, values=self.genre_options)
        self.genre_dropdown.pack()

        tk.Button(self.window, text="Choose Image", command=self.choose_image).pack()
        self.image_path = ""

        tk.Button(self.window, text="Add", command=self.add_book).pack(pady=10)

    def load_genres(self):
        """Lấy danh sách thể loại từ thư mục images/genres."""
        genres = os.listdir("images/genres")
        return [os.path.splitext(g)[0] for g in genres]  # Lấy tên file ảnh bỏ phần mở rộng

    def choose_image(self):
        """Chọn ảnh bìa cho sách."""
        self.image_path = filedialog.askopenfilename(title="Select Image", filetypes=[("Image Files", "*.jpg;*.png;*.jpeg")])

    def add_book(self):
        """Thêm sách mới vào hệ thống."""
        title = self.title_entry.get()
        author = self.author_entry.get()
        genre = self.genre_var.get()
        if title and author and genre and self.image_path:
            self.controller.add_book(title, author, genre, self.image_path)
            self.window.destroy()
        else:
            messagebox.showerror("Error", "All fields are required!")
