import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import os

class UpdateBookWindow:
    def __init__(self, parent, controller, book):
        self.controller = controller
        self.book_id = book["_id"]
        self.window = tk.Toplevel(parent)
        self.window.title("Update Book")
        self.window.geometry("300x250")

        tk.Label(self.window, text="Title").pack()
        self.title_entry = tk.Entry(self.window)
        self.title_entry.insert(0, book["title"])
        self.title_entry.pack()

        tk.Label(self.window, text="Author").pack()
        self.author_entry = tk.Entry(self.window)
        self.author_entry.insert(0, book["author"])
        self.author_entry.pack()

        tk.Label(self.window, text="Genre").pack()

        # Lấy danh sách thể loại từ thư mục images/genres
        self.genre_options = self.load_genres()
        self.genre_var = tk.StringVar()
        self.genre_dropdown = ttk.Combobox(self.window, textvariable=self.genre_var, values=self.genre_options)
        self.genre_dropdown.pack()
        self.genre_dropdown.set(book["genre"])  # Hiển thị thể loại hiện tại

        tk.Button(self.window, text="Choose Image", command=self.choose_image).pack()
        self.image_path = book["image_path"]

        tk.Button(self.window, text="Update", command=self.update_book).pack(pady=10)

    def load_genres(self):
        """Lấy danh sách thể loại từ thư mục images/genres."""
        genres = os.listdir("images/genres")
        return [os.path.splitext(g)[0] for g in genres]  # Lấy tên file ảnh bỏ phần mở rộng

    def choose_image(self):
        """Chọn ảnh mới cho sách."""
        self.image_path = filedialog.askopenfilename(title="Select Image", filetypes=[("Image Files", "*.jpg;*.png;*.jpeg")])

    def update_book(self):
        """Cập nhật sách trong MongoDB."""
        title = self.title_entry.get()
        author = self.author_entry.get()
        genre = self.genre_var.get()  # Lấy giá trị từ Combobox
        if title and author and genre:
            self.controller.update_book(self.book_id, title, author, genre, self.image_path)
            self.window.destroy()
        else:
            messagebox.showerror("Error", "All fields are required!")
