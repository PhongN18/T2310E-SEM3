import tkinter as tk
from PIL import Image, ImageTk

class ViewBooksWindow:
    def __init__(self, root, controller, genre):
        self.controller = controller
        self.frame = tk.Frame(root, bg="#fff3e0")

        tk.Label(self.frame, text=f"Books in {genre}", font=("Arial", 16, "bold"), bg="#fff3e0").pack(pady=10)

        self.books_frame = tk.Frame(self.frame)
        self.books_frame.pack()

        books = self.controller.get_books_by_genre(genre)
        for book in books:
            img = Image.open(book["image_path"]).resize((100, 150), Image.LANCZOS)
            img = ImageTk.PhotoImage(img)

            lbl = tk.Label(self.books_frame, image=img, text=book["title"], compound="top")
            lbl.image = img
            lbl.pack(side="left", padx=10, pady=10)

        # Nút Back
        tk.Button(self.frame, text="Back", command=self.controller.show_view_genres).pack(pady=10)
