import tkinter as tk
from tkinter import scrolledtext, messagebox

class RecipeDetailScreen:
    def __init__(self, root, controller):
        self.frame = tk.Frame(root, bg="#fff3e0")
        self.controller = controller
        
        self.detail_name = tk.Label(self.frame, font=("Helvetica", 28, "bold"), bg="#fff3e0", fg="#f39c12")
        self.detail_name.pack(pady=20)
        
        self.detail_image = tk.Label(self.frame, bg="#fff3e0", borderwidth=2, relief="solid")
        self.detail_image.pack(pady=10)
        
        self.detail_info_frame = tk.Frame(self.frame, bg="#fff3e0")
        self.detail_info_frame.pack(pady=10, padx=50)
        
        tk.Label(self.detail_info_frame, text="Time: ", font=("Helvetica", 14), fg="#2c3e50", bg="#fff3e0").pack(side="left")
        self.detail_time = tk.Label(self.detail_info_frame, font=("Helvetica", 14), fg="#2c3e50", bg="#fff3e0")
        self.detail_time.pack(side="left", padx=5)
        
        tk.Label(self.detail_info_frame, text=" | Serves: ", font=("Helvetica", 14), fg="#2c3e50", bg="#fff3e0").pack(side="left")
        self.detail_serves = tk.Label(self.detail_info_frame, font=("Helvetica", 14), fg="#2c3e50", bg="#fff3e0")
        self.detail_serves.pack(side="left", padx=5)
        
        self.detail_ingredients = tk.Label(self.frame, text="Ingredients: ", font=("Helvetica", 16, "bold"), fg="#2c3e50", bg="#fff3e0", justify="left")
        self.detail_ingredients.pack(pady=5)
        
        self.ingredients_text = tk.Label(self.frame, font=("Helvetica", 14), fg="#2c3e50", bg="#fff", wraplength=800, padx=20, pady=10, justify="left")
        self.ingredients_text.pack(fill="x", pady=5)
        
        self.detail_steps = tk.Label(self.frame, text="Steps: ", font=("Helvetica", 16, "bold"), fg="#2c3e50", bg="#fff3e0", justify="left")
        self.detail_steps.pack(pady=5)
        
        self.steps_text = tk.Label(self.frame, font=("Helvetica", 14), fg="#2c3e50", bg="#ffffff", wraplength=800, padx=20, pady=10, justify="left")
        self.steps_text.pack(fill="x", pady=5)
        
        tk.Label(self.frame, text="Your Feedback:", font=("Helvetica", 16, "bold"), fg="#2c3e50", bg="#fff3e0").pack(pady=10)
        self.feedback_text = tk.Text(self.frame, height=4, width=60, font=("Helvetica", 12), bg="#fff", borderwidth=1, relief="flat")
        self.feedback_text.pack(pady=10)
        tk.Button(self.frame, text="Submit Feedback", font=("Helvetica", 12), bg="#2ecc71", fg="white",
                    relief="flat", command=self.submit_feedback, padx=20, pady=10).pack(pady=10)
        
        tk.Label(self.frame, text="Feedbacks:", font=("Helvetica", 16, "bold"), fg="#2c3e50", bg="#fff3e0").pack(pady=10)
        self.feedback_list = scrolledtext.ScrolledText(self.frame, height=8, width=60, font=("Helvetica", 12), bg="#ffffff", relief="flat", borderwidth=1, wrap=tk.WORD)
        self.feedback_list.pack(pady=10)
        
        tk.Button(self.frame, text="Back to Category", font=("Helvetica", 14), bg="#ecf0f1", fg="#2c3e50", relief="flat", command=lambda: self.controller.show_recipes(self.controller.current_category_id), padx=20, pady=10).place(x=20, y=20)
        tk.Button(self.frame, text="Back to Home", font=("Helvetica", 14), bg="#ecf0f1", fg="#2c3e50", relief="flat", command=self.controller.show_welcome, padx=20, pady=10).place(x=20, y=100)
        
    def update_details(self, recipe):
        self.detail_name.config(text=recipe["name"])
        image = self.controller.get_random_image()
        
        if image:
            self.detail_image.image = image
            self.detail_image.config(image=image)
        self.detail_time.config(text=recipe["time"])
        self.detail_serves.config(text=recipe["serves"])
        self.ingredients_text.config(text=recipe["ingredients"])
        self.steps_text.config(text=recipe["steps"])
        self.feedback_text.delete(1.0, tk.END)
        self.feedback_list.delete(1.0, tk.END)
        
        feedbacks = self.controller.get_feedbacks(recipe["name"])
        for fb in feedbacks:
            self.feedback_list.insert(tk.END, f"- {fb['feedback']}\n")
    
    def submit_feedback(self):
        feedback = self.feedback_text.get(1.0, tk.END).strip()
        recipe_name = self.detail_name.cget("text")
        if not feedback:
            messagebox.showwarning("Error", "Please enter your feedback!")
            return
        self.controller.save_feedback(recipe_name, feedback)
        messagebox.showinfo("Success", "Feedback submitted!")
        self.feedback_text.delete(1.0, tk.END)

        self.update_details(self.controller.get_recipe_by_id(self.controller.current_recipe_id))