import tkinter as tk

class RecipeListScreen:
    def __init__(self, root, controller):
        self.frame = tk.Frame(root, bg="#fff3e0")
        self.controller = controller

        self.title_label = tk.Label(self.frame, text="Recipes", font=("Helvetica", 36, "bold"), bg="#fff3e0", fg="#f39c12")
        self.title_label.pack(pady=50)

        self.canvas = tk.Canvas(self.frame, bg="#fff3e0")
        self.canvas.pack(side="left", fill="both", expand=True)

        self.scrollbar = tk.Scrollbar(self.frame, orient="vertical", command=self.canvas.yview)
        self.scrollbar.pack(side="right", fill="y")
        self.canvas.config(yscrollcommand=self.scrollbar.set)

        self.recipe_frame = tk.Frame(self.canvas, bg="#fff3e0")
        self.canvas.create_window((0, 0), window=self.recipe_frame, anchor="nw")
        
        tk.Button(self.frame, text="Back", font=("Helvetica", 14), bg="#e74c3c", fg="white",
                    relief="flat", command=self.controller.show_categories, padx=20, pady=10).place(x=20, y=20)

    def update_recipes(self, recipes, category):
        if category:
            self.title_label.config(text=f"Recipes - {category['name']}")  # Update the existing label text
        
        for widget in self.recipe_frame.winfo_children():
            widget.destroy()

        for recipe in recipes:
            frame = tk.Frame(self.recipe_frame, bg="#fff", borderwidth=1, relief="solid")
            frame.pack(fill="x", pady=10, padx=50)

            image = self.controller.get_random_image()
            if image:
                img_label = tk.Label(frame, image=image, bg="#fff")
                img_label.image = image
                img_label.pack(side="left", padx=10)

            tk.Label(frame, text=recipe["name"], font=("Helvetica", 16, "bold"), bg="#fff", fg="#2c3e50",
                        wraplength=500).pack(side="left", padx=10, pady=5)

            tk.Button(frame, text="View", font=("Helvetica", 12), bg="#f1c40f", fg="white", relief="flat",
                        command=lambda rid=recipe["id"]: self.controller.show_recipe_detail(rid), padx=15, pady=5).pack(side="right", padx=10)

        self.recipe_frame.update_idletasks()
        self.canvas.config(scrollregion=self.canvas.bbox("all"))
