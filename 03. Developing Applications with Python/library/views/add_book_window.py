import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from PIL import Image, ImageTk
import shutil
import os

class AddBookWindow:
    def __init__(self, parent, controller):
        self.controller = controller
        self.window = tk.Toplevel(parent)
        self.window.title("Add New Book")
        self.window.geometry("400x500")
        self.window.transient(parent)  # Đảm bảo cửa sổ luôn nằm trên
        self.window.grab_set()  # Giữ focus trên cửa sổ này

        tk.Label(self.window, text="Title").pack()
        self.title_entry = tk.Entry(self.window)
        self.title_entry.pack()

        tk.Label(self.window, text="Author").pack()
        self.author_entry = tk.Entry(self.window)
        self.author_entry.pack()

        tk.Label(self.window, text="Genre").pack()
        self.genre_options = self.load_genres()
        self.genre_var = tk.StringVar()
        self.genre_dropdown = ttk.Combobox(self.window, textvariable=self.genre_var, values=self.genre_options)
        self.genre_dropdown.pack()

        tk.Label(self.window, text="Price").pack()
        self.price_entry = tk.Entry(self.window)
        self.price_entry.pack()

        # Nút chọn ảnh
        tk.Button(self.window, text="Choose Image", command=self.choose_image).pack(pady=5)

        # Hiển thị preview ảnh
        self.image_preview = tk.Label(self.window)
        self.image_preview.pack(pady=5)

        # Nhãn thông báo lỗi
        self.error_label = tk.Label(self.window, text="", fg="red")
        self.error_label.pack()

        # Nút thêm sách
        tk.Button(self.window, text="Add", command=self.add_book).pack(pady=10)

        self.image_path = ""  # Đường dẫn ảnh gốc
        self.final_image_path = ""  # Đường dẫn ảnh sau khi lưu vào thư mục books

    def load_genres(self):
        """Load genres from the folder 'images/genres'."""
        genres = os.listdir("images/genres")
        return [os.path.splitext(g)[0] for g in genres]

    def choose_image(self):
        """Chọn ảnh và hiển thị preview."""
        file_path = filedialog.askopenfilename(title="Select Image", filetypes=[("Image Files", "*.jpg;*.png;*.jpeg")])
        if file_path:
            self.image_path = file_path

            # Hiển thị preview ảnh
            try:
                img = Image.open(self.image_path)
                img = img.resize((150, 150), Image.LANCZOS)
                img = ImageTk.PhotoImage(img)
                self.image_preview.config(image=img)
                self.image_preview.image = img
                self.show_message("Image loaded successfully.", "green")
            except Exception as e:
                self.show_message(f"Error loading image: {e}", "red")

        # Đảm bảo cửa sổ luôn nằm trên sau khi chọn ảnh
        self.window.lift()
        self.window.grab_set()

    def show_message(self, message, color="red"):
        """Hiển thị thông báo trên cửa sổ."""
        self.error_label.config(text=message, fg=color)

    def save_image(self, title):
        """Lưu ảnh vào thư mục 'images/books'."""
        if not self.image_path:
            return None
        
        # Tạo thư mục nếu chưa có
        if not os.path.exists("images/books"):
            os.makedirs("images/books")

        # Tạo tên file không trùng lặp bằng cách thêm title
        file_name = f"{title.replace(' ', '_').lower()}_{os.path.basename(self.image_path)}"
        self.final_image_path = os.path.join("images/books", file_name)

        try:
            shutil.copy(self.image_path, self.final_image_path)
            return self.final_image_path
        except Exception as e:
            self.show_message(f"Could not save image: {e}")
            return None

    def add_book(self):
        """Add new book to the database."""
        title = self.title_entry.get().strip()
        author = self.author_entry.get().strip()
        genre = self.genre_var.get().strip()
        price = self.price_entry.get().strip()

        # Kiểm tra lỗi
        if not title or not author or not genre:
            self.show_message("All fields are required!")
            return
        if not price.replace('.', '', 1).isdigit():
            self.show_message("Price must be a number!")
            return
        if not self.image_path:
            self.show_message("Please choose an image!")
            return

        # Lưu ảnh vào thư mục chỉ khi nhấn nút "Add"
        image_path = self.save_image(title)

        if image_path:
            try:
                self.controller.add_book(title, author, genre, image_path, int(price))
                self.show_message("Book added successfully!", "green")
                self.window.destroy()
            except Exception as e:
                self.show_message(f"Failed to add book: {e}")
        else:
            self.show_message("Error saving image!")
