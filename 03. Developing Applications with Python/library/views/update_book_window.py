import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from PIL import Image, ImageTk
import shutil
import os

class UpdateBookWindow:
    def __init__(self, parent, controller, book):
        self.controller = controller
        self.book = book
        self.window = tk.Toplevel(parent)
        self.window.title("Update Book")
        self.window.geometry("400x500")
        self.window.transient(parent)
        self.window.grab_set()

        # Tiêu đề
        tk.Label(self.window, text="Title").pack()
        self.title_entry = tk.Entry(self.window)
        self.title_entry.pack()
        self.title_entry.insert(0, book.get("title", ""))

        # Tác giả
        tk.Label(self.window, text="Author").pack()
        self.author_entry = tk.Entry(self.window)
        self.author_entry.pack()
        self.author_entry.insert(0, book.get("author", ""))

        # Thể loại
        tk.Label(self.window, text="Genre").pack()
        self.genre_options = self.load_genres()
        self.genre_var = tk.StringVar()
        self.genre_dropdown = ttk.Combobox(self.window, textvariable=self.genre_var, values=self.genre_options)
        self.genre_dropdown.pack()
        self.genre_var.set(book.get("genre", ""))

        # Giá
        tk.Label(self.window, text="Price").pack()
        self.price_entry = tk.Entry(self.window)
        self.price_entry.pack()
        self.price_entry.insert(0, str(book.get("price", "")))

        # Nút chọn ảnh
        tk.Button(self.window, text="Choose Image", command=self.choose_image).pack(pady=5)

        # Hiển thị preview ảnh
        self.image_preview = tk.Label(self.window)
        self.image_preview.pack(pady=5)

        # Hiển thị ảnh từ database
        self.image_path = book.get("image_path", "")
        if self.image_path:
            self.show_image(self.image_path)

        # Nhãn thông báo lỗi
        self.error_label = tk.Label(self.window, text="", fg="red")
        self.error_label.pack()

        # Nút cập nhật sách
        tk.Button(self.window, text="Update", command=self.update_book).pack(pady=10)

    def load_genres(self):
        """Load genres từ thư mục 'images/genres'."""
        genres = os.listdir("images/genres")
        return [os.path.splitext(g)[0] for g in genres]

    def choose_image(self):
        """Chọn ảnh và hiển thị preview."""
        file_path = filedialog.askopenfilename(title="Select Image", filetypes=[("Image Files", "*.jpg;*.png;*.jpeg")])
        if file_path:
            self.image_path = file_path
            self.show_image(self.image_path)

    def show_image(self, image_path):
        """Hiển thị ảnh từ đường dẫn."""
        try:
            img = Image.open(image_path)
            img = img.resize((150, 150), Image.LANCZOS)
            img = ImageTk.PhotoImage(img)
            self.image_preview.config(image=img)
            self.image_preview.image = img
        except Exception as e:
            self.show_message(f"Error loading image: {e}", "red")

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
        final_image_path = os.path.join("images/books", file_name)

        try:
            shutil.copy(self.image_path, final_image_path)
            return final_image_path
        except Exception as e:
            self.show_message(f"Could not save image: {e}")
            return None

    def update_book(self):
        """Cập nhật sách trong cơ sở dữ liệu."""
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

        # Lưu ảnh nếu người dùng chọn ảnh mới
        image_path = self.image_path
        if os.path.exists(image_path):
            image_path = self.save_image(title)

        # Cập nhật sách vào cơ sở dữ liệu
        try:
            self.controller.update_book(self.book["_id"], title, author, genre, image_path, int(price))
            self.show_message("Book updated successfully!", "green")
            self.window.destroy()
        except Exception as e:
            self.show_message(f"Failed to update book: {e}")