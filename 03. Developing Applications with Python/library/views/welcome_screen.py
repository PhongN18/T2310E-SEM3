import tkinter as tk

class WelcomeScreen:
    def __init__(self, root, controller):
        self.controller = controller
        self.frame = tk.Frame(root, bg="#fff3e0")
        self.frame.pack(fill="both", expand=True)

        tk.Label(self.frame, text="Welcome to Library Manager", font=("Arial", 20, "bold"), bg="#fff3e0").pack(pady=50)

        tk.Button(self.frame, text="Manage Library", font=("Arial", 14), bg="#f1c40f", command=self.controller.show_manage_library).pack(pady=10)
        tk.Button(self.frame, text="View Books", font=("Arial", 14), bg="#3498db", command=self.controller.show_view_books).pack(pady=10)
