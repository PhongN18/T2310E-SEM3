import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk
import os

class ViewBooksWindow:
    def __init__(self, root, controller):
        self.controller = controller
        self.frame = tk.Frame(root, bg="#fff3e0")
        
        # Nút Back
        tk.Button(self.frame, text="Back to menu", command=self.controller.show_welcome).place(x=20, y=20)

        # Thanh tìm kiếm và lọc
        search_frame = tk.Frame(self.frame, bg="#fff3e0")
        search_frame.pack(pady=10)

        # Search theo tên sách
        tk.Label(search_frame, text="Search by Title:", bg="#fff3e0").grid(row=0, column=0, padx=5)
        self.search_title_entry = tk.Entry(search_frame)
        self.search_title_entry.grid(row=0, column=1, padx=5)

        # Search theo tên tác giả
        tk.Label(search_frame, text="Search by Author:", bg="#fff3e0").grid(row=0, column=2, padx=5)
        self.search_author_entry = tk.Entry(search_frame)
        self.search_author_entry.grid(row=0, column=3, padx=5)

        # Filter theo genre
        tk.Label(search_frame, text="Filter by Genre:", bg="#fff3e0").grid(row=1, column=0, padx=5, pady=5)
        self.genre_var = tk.StringVar()
        self.genre_dropdown = ttk.Combobox(search_frame, textvariable=self.genre_var, state="readonly")
        self.genre_dropdown.grid(row=1, column=1, padx=5, pady=5)
        self.genre_dropdown.bind("<<ComboboxSelected>>", self.filter_books)

        # Sort theo giá tiền
        tk.Label(search_frame, text="Sort by Price:", bg="#fff3e0").grid(row=1, column=2, padx=5, pady=5)
        self.sort_var = tk.StringVar()
        self.sort_dropdown = ttk.Combobox(search_frame, textvariable=self.sort_var, state="readonly")
        self.sort_dropdown["values"] = ["Ascending", "Descending"]
        self.sort_dropdown.current(0)
        self.sort_dropdown.grid(row=1, column=3, padx=5, pady=5)
        self.sort_dropdown.bind("<<ComboboxSelected>>", self.sort_books)

        # Nút tìm kiếm
        tk.Button(search_frame, text="Search", command=self.search_books).grid(row=0, column=4, padx=5)

        # Khu vực danh sách sách có thanh cuộn
        canvas = tk.Canvas(self.frame, bg="#fff3e0")
        scrollbar = ttk.Scrollbar(self.frame, orient="vertical", command=canvas.yview)
        scrollable_frame = tk.Frame(canvas, bg="#fff3e0")

        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(
                scrollregion=canvas.bbox("all")
            )
        )

        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

        self.books_frame = scrollable_frame
        self.load_books()

    def load_books(self):
        """Load tất cả sách từ database."""
        books = self.controller.db.get_books()
        self.update_book_list(books)
        self.load_genres()

    def load_genres(self):
        """Lấy danh sách thể loại từ thư mục images/genres."""
        genres = os.listdir("images/genres")
        genre_list = [os.path.splitext(g)[0] for g in genres]
        genre_list.insert(0, "All Genres")
        self.genre_dropdown["values"] = genre_list
        self.genre_dropdown.current(0)

    def update_book_list(self, books):
        """Cập nhật danh sách sách."""
        for widget in self.books_frame.winfo_children():
            widget.destroy()

        row_frame = None
        for index, book in enumerate(books):
            # Tạo dòng mới sau mỗi 2 cuốn sách
            if index % 2 == 0:
                row_frame = tk.Frame(self.books_frame, bg="#fff3e0")
                row_frame.pack(pady=15, padx=50, fill="x", expand=True)

            book_frame = tk.Frame(row_frame, bg="#f5deb3", padx=20, pady=10, bd=2, relief="groove")
            
            # Hiển thị ảnh bìa sách
            img = Image.open(book["image_path"]).resize((120, 180), Image.LANCZOS)
            img = ImageTk.PhotoImage(img)

            img_label = tk.Label(book_frame, image=img, bg="#f5deb3")
            img_label.image = img
            img_label.pack(side="left", padx=10)

            # Khung thông tin sách
            info_frame = tk.Frame(book_frame, bg="#f5deb3")
            info_frame.pack(side="left", padx=10)

            title = book.get("title", "Unknown")
            author = book.get("author", "Unknown")
            genre = book.get("genre", "Unknown")
            price = f"{int(book.get('price', 0)):,} VND"

            tk.Label(info_frame, text=f"{title}", bg="#f5deb3", font=("Arial", 12, "bold"), anchor="w").pack(anchor="w")
            tk.Label(info_frame, text=f"Author: {author}", bg="#f5deb3", anchor="w").pack(anchor="w")
            tk.Label(info_frame, text=f"Genre: {genre}", bg="#f5deb3", anchor="w").pack(anchor="w")
            tk.Label(info_frame, text=f"Price: {price}", bg="#f5deb3", anchor="w").pack(anchor="w")

            # Điều chỉnh căn giữa
            book_frame.pack(side="left", padx=20, pady=10, fill="x", expand=True)

    def search_books(self):
        """Tìm kiếm sách theo tên và tác giả."""
        title_term = self.search_title_entry.get().strip().lower()
        author_term = self.search_author_entry.get().strip().lower()
        all_books = self.controller.db.get_books()

        filtered_books = [
            book for book in all_books
            if (title_term in book.get("title", "").lower()) and (author_term in book.get("author", "").lower())
        ]
        self.update_book_list(filtered_books)

    def filter_books(self, event=None):
        """Lọc sách theo thể loại."""
        selected_genre = self.genre_var.get()
        all_books = self.controller.db.get_books()

        if selected_genre == "All Genres":
            self.update_book_list(all_books)
        else:
            filtered_books = [book for book in all_books if book.get("genre") == selected_genre]
            self.update_book_list(filtered_books)

    def sort_books(self, event=None):
        """Sắp xếp sách theo giá tiền."""
        all_books = self.controller.db.get_books()
        order = self.sort_var.get() == "Descending"

        sorted_books = sorted(all_books, key=lambda x: x.get("price", 0), reverse=order)
        self.update_book_list(sorted_books)
