from pymongo import MongoClient
import tkinter as tk
from tkinter import messagebox, ttk
import sys

class MongoCRUD:
    def __init__(self):
        # Connect to MongoDB
        self.client = MongoClient('mongodb://localhost:27017')
        self.db = self.client["mydatabase"]
        self.collection = self.db['users']
        
        # Tkinter Interface
        self.window = tk.Tk()
        self.window.title("User Management")
        self.window.geometry("700x400")
        
        # Frame for input
        input_frame = tk.LabelFrame(self.window, text="User info", padx=10, pady=10)
        input_frame.pack(padx=5, pady=5, fill="x")
        
        # Input fields
        tk.Label(input_frame, text="Name: ").grid(row=0, column=0, padx=5, pady=5)
        self.name_entry = tk.Entry(input_frame)
        self.name_entry.grid(row=0, column=1, padx=5, pady=5)
        
        tk.Label(input_frame, text="Age: ").grid(row=1, column=0, padx=5, pady=5)
        self.age_entry = tk.Entry(input_frame)
        self.age_entry.grid(row=1, column=1, padx=5, pady=5)

        tk.Label(input_frame, text="Email: ").grid(row=2, column=0, padx=5, pady=5)
        self.email_entry = tk.Entry(input_frame)
        self.email_entry.grid(row=2, column=1, padx=5, pady=5)
        
        # Frame for buttons
        button_frame = tk.Frame(self.window)
        button_frame.pack(pady=10)
        
        # Buttons
        tk.Button(button_frame, text="Add User", command=self.create).pack(side=tk.LEFT, padx=5)
        tk.Button(button_frame, text="View List", command=self.read).pack(side=tk.LEFT, padx=5)
        tk.Button(button_frame, text="Update User", command=self.update).pack(side=tk.LEFT, padx=5)
        tk.Button(button_frame, text="Delete User", command=self.delete).pack(side=tk.LEFT, padx=5)
        tk.Button(button_frame, text="Exit", command=self.quit).pack(side=tk.LEFT, padx=5)
        
        # Data table
        self.tree = ttk.Treeview(self.window, columns=("ID", "Name", "Age", "Email"), show="headings")
        self.tree.heading("ID", text="ID")
        self.tree.heading("Name", text="Name")
        self.tree.heading("Age", text="Age")
        self.tree.heading("Email", text="Email")
        
        self.tree.column("ID", width=180)
        self.tree.column("Name", width=150)
        self.tree.column("Age", width=50, anchor="center")
        self.tree.column("Email", width=200)

        self.tree.pack(padx=10, pady=10, fill="both", expand=True)

    def clear_entries(self):
        self.name_entry.delete(0, tk.END)
        self.age_entry.delete(0, tk.END)
        self.email_entry.delete(0, tk.END)

    def create(self):
        try:
            name = self.name_entry.get()
            age = int(self.age_entry.get())
            email = self.email_entry.get()
            
            if not all([name, age, email]):
                messagebox.showerror("Error", "Please fill all information!")
                return
            
            user = { "name": name, "age": age, "email": email }
            result = self.collection.insert_one(user)
            
            self.clear_entries()
            self.read()
            messagebox.showinfo("Success", f"Added user with ID: {result.inserted_id}")
        except ValueError:
            messagebox.showerror("Error", "Age must be an integer!")
        except Exception as e:
            messagebox.showerror("Error", f"Error: {e}")

    def read(self):
        self.tree.delete(*self.tree.get_children())
        users = self.collection.find()
        for user in users:
            self.tree.insert("", "end", values=(str(user["_id"]), user["name"], user["age"], user["email"]))
    
    def update(self):
        try:
            email = self.email_entry.get()
            if not email:
                messagebox.showerror("Error", "Please provide email for updating!")
                return

            update_data = {}
            if self.name_entry.get(): update_data["name"] = self.name_entry.get()
            if self.age_entry.get(): update_data["age"] = int(self.age_entry.get())
            
            if update_data:
                result = self.collection.update_one(
                    { "email": email },
                    { "$set": update_data }
                )
                self.clear_entries()
                self.read()
                if result.modified_count > 0:
                    messagebox.showinfo("Success", "Update successfully!")
                else:
                    messagebox.showwarning("Warning", "No users found or no changes made.")
            else:
                messagebox.showwarning("Warning", "Provide at least 1 information to update")
        except ValueError:
            messagebox.showerror("Error", "Age must be an integer!")
        except Exception as e:
            messagebox.showerror("Error", f"Error: {e}")
    
    def delete(self):
        try:
            email = self.email_entry.get()
            if not email:
                messagebox.showerror("Error", "Please provide email to delete!")
                return
            
            result = self.collection.delete_one({ "email": email })
            self.clear_entries()
            self.read()
            if result.deleted_count > 0:
                messagebox.showinfo("Success", "Delete user successfully!")
            else:
                messagebox.showwarning("Warning", "No users found with this email!")
        
        except Exception as e:
            messagebox.showerror("Error", f"Error: {e}")
            
    def quit(self):
        self.client.close()
        self.window.quit()
        sys.exit(0)
        
    def run(self):
        self.window.mainloop()
        
if __name__ == "__main__":
    app = MongoCRUD()
    app.run()