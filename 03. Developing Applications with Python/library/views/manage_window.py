import tkinter as tk
from tkinter import ttk

class ManageWindow:
    def __init__(self, root, controller):
        self.controller = controller
        self.frame = tk.Frame(root, bg="#fff3e0")

        tk.Label(self.frame, text="Manage Library", font=("Arial", 16, "bold"), bg="#fff3e0").pack(pady=10)

        self.tree = ttk.Treeview(self.frame, columns=("ID", "Title", "Author", "Genre"), show="headings")
        self.tree.heading("ID", text="ID")
        self.tree.heading("Title", text="Title")
        self.tree.heading("Author", text="Author")
        self.tree.heading("Genre", text="Genre")
        self.tree.column("ID", width=50)
        self.tree.pack(pady=10, fill=tk.BOTH, expand=True)

        button_frame = tk.Frame(self.frame)
        button_frame.pack(pady=10)

        tk.Button(button_frame, text="Add Book", command=self.controller.show_add_book).grid(row=0, column=0, padx=5)
        tk.Button(button_frame, text="Update Book", command=self.controller.show_update_book).grid(row=0, column=1, padx=5)
        tk.Button(button_frame, text="Delete Book", command=self.controller.delete_book).grid(row=0, column=2, padx=5)
        tk.Button(button_frame, text="Back", command=self.controller.show_welcome).grid(row=0, column=3, padx=5)

    def update_book_list(self, books):
        """Cập nhật danh sách sách trong Treeview."""
        self.tree.delete(*self.tree.get_children())
        for book in books:
            self.tree.insert("", "end", values=(str(book["_id"]), book["title"], book["author"], book["genre"]))

    def get_selected_book_id(self):
        """Lấy ID sách đang được chọn trong Treeview."""
        selected_item = self.tree.selection()
        if selected_item:
            return self.tree.item(selected_item)["values"][0]
        return None
