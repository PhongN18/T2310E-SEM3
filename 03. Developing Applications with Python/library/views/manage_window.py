import tkinter as tk
from tkinter import ttk, messagebox
import os

class ManageWindow:
    def __init__(self, root, controller):
        self.controller = controller
        self.frame = tk.Frame(root, bg="#fff3e0")

        tk.Label(self.frame, text="Manage Library", font=("Arial", 16, "bold"), bg="#fff3e0").pack(pady=10)

        # Khung tìm kiếm và lọc
        search_frame = tk.Frame(self.frame, bg="#fff3e0")
        search_frame.pack(pady=5)

        # Ô tìm kiếm theo tên sách
        tk.Label(search_frame, text="Search by Title:", bg="#fff3e0").grid(row=0, column=0, padx=5)
        self.search_entry = tk.Entry(search_frame)
        self.search_entry.grid(row=0, column=1, padx=5)

        # Nút tìm kiếm
        tk.Button(search_frame, text="Search", command=self.search_books).grid(row=0, column=2, padx=5)

        # Dropdown chọn thể loại
        tk.Label(search_frame, text="Filter by Genre:", bg="#fff3e0").grid(row=0, column=3, padx=5)
        self.genre_var = tk.StringVar()
        self.genre_dropdown = ttk.Combobox(search_frame, textvariable=self.genre_var, state="readonly")
        self.genre_dropdown.grid(row=0, column=4, padx=5)
        self.genre_dropdown.bind("<<ComboboxSelected>>", lambda event: self.filter_books())

        # Nút xóa bộ lọc
        tk.Button(search_frame, text="Clear Filter", command=self.clear_filters).grid(row=0, column=5, padx=5)

        # Dropdown chọn sắp xếp
        tk.Label(search_frame, text="Sort by:", bg="#fff3e0").grid(row=1, column=0, padx=5, pady=5)
        self.sort_var = tk.StringVar()
        self.sort_dropdown = ttk.Combobox(search_frame, textvariable=self.sort_var, state="readonly")
        self.sort_dropdown['values'] = ["Default", "Title", "Price", "Sales Count", "Sales Revenue"]
        self.sort_dropdown.current(0)
        self.sort_dropdown.grid(row=1, column=1, padx=5, pady=5)
        self.sort_dropdown.bind("<<ComboboxSelected>>", lambda event: self.sort_books())

        # Dropdown chọn thứ tự sắp xếp (Ascending/Descending)
        tk.Label(search_frame, text="Order:", bg="#fff3e0").grid(row=1, column=3, padx=5, pady=5)
        self.order_var = tk.StringVar()
        self.order_dropdown = ttk.Combobox(search_frame, textvariable=self.order_var, state="readonly")
        self.order_dropdown['values'] = ["Ascending", "Descending"]
        self.order_dropdown.current(1)  # Mặc định là Descending
        self.order_dropdown.grid(row=1, column=4, padx=5, pady=5)
        self.order_dropdown.bind("<<ComboboxSelected>>", lambda event: self.sort_books())

        # Bảng danh sách sách
        columns = ("Numerate", "ID", "Title", "Author", "Genre", "Sales Count", "Sales Revenue", "Price")
        self.tree = ttk.Treeview(self.frame, columns=columns, show="headings")
        
        # Thiết lập tiêu đề cột
        self.tree.heading("Numerate", text="No.")
        self.tree.heading("ID", text="ID")
        self.tree.heading("Title", text="Title")
        self.tree.heading("Author", text="Author")
        self.tree.heading("Genre", text="Genre")
        self.tree.heading("Sales Count", text="Sales Count")
        self.tree.heading("Sales Revenue", text="Sales Revenue")
        self.tree.heading("Price", text="Price")

        # Thiết lập độ rộng cột
        self.tree.column("Numerate", width=50)
        self.tree.column("ID", width=50)
        self.tree.column("Title", width=200)
        self.tree.column("Author", width=150)
        self.tree.column("Genre", width=100)
        self.tree.column("Sales Count", width=100)
        self.tree.column("Sales Revenue", width=120)
        self.tree.column("Price", width=80)

        self.tree.pack(pady=10, fill=tk.BOTH, expand=True)

        button_frame = tk.Frame(self.frame)
        button_frame.config(bg="#fff3e0")
        button_frame.pack(pady=10)

        tk.Button(button_frame, text="Add Book", command=self.controller.show_add_book).grid(row=0, column=0, padx=5)
        tk.Button(button_frame, text="Update Book", command=self.update_book).grid(row=0, column=1, padx=5)
        tk.Button(button_frame, text="Delete Book", command=self.delete_book).grid(row=0, column=2, padx=5)
        tk.Button(button_frame, text="Data Analysis", command=self.controller.show_analysis).grid(row=1, column=1, padx=5, pady=5)
        tk.Button(button_frame, text="Back", command=self.controller.show_welcome).grid(row=2, column=1, padx=5, pady=5)

        self.load_genres()

    def load_genres(self):
        """Lấy danh sách thể loại từ thư mục images/genres."""
        genres = os.listdir("images/genres")
        genre_list = [os.path.splitext(g)[0] for g in genres]
        genre_list.insert(0, "All Genres")
        self.genre_dropdown["values"] = genre_list
        self.genre_dropdown.current(0)

    def update_book_list(self, books):
        """Cập nhật danh sách sách trong Treeview."""
        self.tree.delete(*self.tree.get_children())
        for index, book in enumerate(books, start=1):
            price = f"{int(book.get('price', 0)):,}"
            revenue = f"{int(book.get('sales_revenue', 0)):,}"
            self.tree.insert("", "end", values=(
                index,
                str(book["_id"]),
                book["title"],
                book["author"],
                book["genre"],
                book.get("sales_count", 0),
                revenue,
                price
            ))
            
    def update_book(self):
        """Xử lý khi nhấn nút Update Book."""
        book_id = self.get_selected_book_id()
        if book_id:
            self.controller.show_update_book(book_id)

    def delete_book(self):
        """Xử lý khi nhấn nút Delete Book."""
        book_id = self.get_selected_book_id()
        if book_id:
            self.controller.delete_book(book_id)

    def get_selected_book_id(self):
        """Lấy ID sách đang được chọn trong Treeview."""
        selected_item = self.tree.selection()
        if selected_item:
            return self.tree.item(selected_item)["values"][1]
        messagebox.showwarning("No Selection", "Please select a book from the list before proceeding.")
        return None

    def search_books(self):
        """Tìm kiếm sách theo tên."""
        search_term = self.search_entry.get().strip().lower()
        if search_term:
            all_books = self.controller.db.get_books()
            filtered_books = [book for book in all_books if search_term in book["title"].lower()]
            self.update_book_list(filtered_books)
        else:
            self.controller.load_books()

    def filter_books(self):
        """Lọc sách theo thể loại."""
        selected_genre = self.genre_var.get()
        if selected_genre == "All Genres":
            self.controller.load_books()
        else:
            all_books = self.controller.db.get_books()
            filtered_books = [book for book in all_books if book["genre"] == selected_genre]
            self.update_book_list(filtered_books)

    def clear_filters(self):
        """Xóa bộ lọc và tìm kiếm."""
        self.search_entry.delete(0, tk.END)
        self.genre_dropdown.set("All Genres")
        self.sort_dropdown.set("Default")
        self.controller.load_books()

    def sort_books(self):
        """Sắp xếp sách theo tiêu chí được chọn."""
        all_books = self.controller.db.get_books()
        sort_criterion = self.sort_var.get()
        order = self.order_var.get() == "Descending"  # True nếu chọn Descending, False nếu chọn Ascending
        
        if sort_criterion == "Title":
            sorted_books = sorted(all_books, key=lambda x: x.get("title", "").lower(), reverse=order)
        elif sort_criterion == "Price":
            sorted_books = sorted(all_books, key=lambda x: x.get("price", 0), reverse=order)
        elif sort_criterion == "Sales Count":
            sorted_books = sorted(all_books, key=lambda x: x.get("sales_count", 0), reverse=order)
        elif sort_criterion == "Sales Revenue":
            sorted_books = sorted(all_books, key=lambda x: x.get("sales_revenue", 0.0), reverse=order)
        else:
            sorted_books = all_books

        self.update_book_list(sorted_books)
