import tkinter as tk
from PIL import Image, ImageTk
import os

class ViewGenresWindow:
    def __init__(self, root, controller):
        self.controller = controller
        self.frame = tk.Frame(root, bg="#fff3e0")

        tk.Label(self.frame, text="Select Genre", font=("Arial", 16, "bold"), bg="#fff3e0").pack(pady=10)

        self.genre_frame = tk.Frame(self.frame)
        self.genre_frame.pack()

        self.load_genres()

        # Nút Back
        tk.Button(self.frame, text="Back", command=self.controller.show_welcome).pack(pady=10)

    def load_genres(self):
        genres = os.listdir("images/genres")
        for genre_file in genres:
            genre_name = os.path.splitext(genre_file)[0]
            img_path = os.path.join("images/genres", genre_file)

            img = Image.open(img_path).resize((100, 100), Image.LANCZOS)
            img = ImageTk.PhotoImage(img)

            btn = tk.Button(self.genre_frame, image=img, text=genre_name, compound="top",
                            command=lambda g=genre_name: self.controller.show_books_by_genre(g))
            btn.image = img
            btn.pack(side="left", padx=10, pady=10)
