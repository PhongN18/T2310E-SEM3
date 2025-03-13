import tkinter as tk
from check_sudoku_solution import is_valid

class SudokuGame:
    def __init__(self, root):
        self.root = root
        self.root.title("Sudoku")
        self.center_window(self.root, 400, 550)
        self.root.configure(bg='#d4e6f1')
        
        # Canvas for sudoku grid
        self.canvas = tk.Canvas(self.root, width=360, height=360, bg="white")
        self.canvas.pack(pady=10)
        self.draw_grid()
        
        # Entries
        self.entries = []
        self.create_sudoku_grid()
        
        # Buttons frame
        self.button_frame = tk.Frame(self.root, bg='#d4e6f1')
        self.button_frame.pack(pady=10)
        
        # Validate button
        self.validate_button = self.create_button(
            "✓ Check", self.validate_solution, "#d4e6f1", "#e74c3c", "#154360"
        )
        self.validate_button.pack(side="left", padx=10)
        
        # Generate example button
        self.generate_button = self.create_button(
            "🎲 Sample Sudoku", self.generate_example, "#d4e6f1", "#aed6f1", "#154360"
        )
        self.generate_button.pack(side="left", padx=10)
        
        # Result label
        self.result_label = tk.Label(
            self.root, text="Fill in the Sudoku grid then check!",
            font=('Arial', 14, 'bold'), bg="#d4e6f1", fg="black"
        )
        self.result_label.pack(pady=10)
        
    def draw_grid(self):
        """Draw Sudoku grid on canvas with border for 3x3 blocks"""
        for i in range(10):
            width = 3 if i % 3 == 0 else 1
            self.canvas.create_line(0, i * 40, 360, i * 40, width=width, fill="black")
            self.canvas.create_line(i * 40, 0, i * 40, 360, width=width, fill="black")
    
    def create_sudoku_grid(self):
        """Create 9x9 Sudoku grid with entries"""
        for i in range(9):
            row_entries = []
            for j in range(9):
                entry = tk.Entry(
                    self.root, width=2, font=("Arial", 16, "bold"),
                    justify="center", fg="black", bg="white", relief="flat"
                )
                # Place entry to the corresponding place in the canvas
                self.canvas.create_window(j * 40 + 20, i * 40 + 20, window=entry, width=35, height=35)
                row_entries.append(entry)
            self.entries.append(row_entries)
    
    def create_button(self, text, command, bg_color, hover_color, text_color):
        """Create button with effects"""
        btn = tk.Button(
            self.button_frame, text=text, font=("Arial", 14, "bold"), command=command,
            bg=bg_color, fg=text_color, activebackground=hover_color, relief="flat", bd=5, padx=10, pady=5
        )
        
        # Hover effect
        btn.bind("<Enter>", lambda event: btn.config(bg=hover_color, fg=text_color))
        btn.bind("<Leave>", lambda event: btn.config(bg=bg_color, fg=text_color))
        
        return btn

    def get_grid(self):
        """Get Sudoku data from UI with 9x9 array format"""
        grid = []
        for row in self.entries:
            grid.append([entry.get() if entry.get().isdigit() else "0" for entry in row])
        return [[int(num) for num in line] for line in grid]
    
    def validate_solution(self):
        """Check solution with is_valid()"""
        grid = self.get_grid()
        if is_valid(grid):
            self.change_cell_colors("#a9dfbf")
            self.result_label.config(text="✅ Correct!", fg="green")
        else:
            self.change_cell_colors("#d3d3d3")
            self.result_label.config(text="❎ Incorrect!", fg="green")
            
    
    def change_cell_colors(self, color):
        """Change all entries' color"""
        for row in self.entries:
            for entry in row:
                entry.config(bg=color)
                
    def generate_example(self):
        """Give a sample Sudoku solution"""
        example_grid = [
            [9, 6, 3, 1, 7, 4, 2, 5, 8],
            [1, 7, 8, 3, 2, 5, 6, 4, 9],
            [2, 5, 4, 6, 8, 9, 7, 3, 1],
            [8, 2, 1, 4, 3, 7, 5, 9, 6],
            [4, 9, 6, 8, 5, 2, 3, 1, 7],
            [7, 3, 5, 9, 6, 1, 8, 2, 4],
            [5, 8, 9, 7, 1, 3, 4, 6, 2],
            [3, 1, 7, 2, 4, 6, 9, 8, 5],
            [6, 4, 2, 5, 9, 8, 1, 7, 3]
        ]
        
        for i in range(9):
            for j in range(9):
                self.entries[i][j].delete(0, tk.END)
                self.entries[i][j].insert(0, str(example_grid[i][j]))
                self.entries[i][j].config(bg="white")
        self.result_label.config(text="Fill in the Sudoku grid then check!", fg="black")
        
    def center_window(self, window, width, height):
        """Center the window (by the screen)"""
        screen_width = window.winfo_screenwidth()
        screen_height = window.winfo_screenheight()
        x = (screen_width - width) // 2
        y = (screen_height - height) // 2
        window.geometry(f"{width}x{height}+{x}+{y}")

if __name__ == "__main__":
    root = tk.Tk()
    game = SudokuGame(root)
    root.mainloop()