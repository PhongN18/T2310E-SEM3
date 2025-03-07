import tkinter as tk
from tkinter import messagebox, Toplevel, Label, Button

# Board size
BOARD_SIZE = 10

class CaroGame:
    def __init__(self, root):
        self.root = root
        self.root.title("Tic Tac Toe - Tkinter")
        self.root.configure(bg="#d4e6f1")

        # Window center
        self.center_window(self.root, 500, 600)

        # Board state
        self.board = [["" for _ in range(BOARD_SIZE)] for _ in range (BOARD_SIZE)]
        self.current_player = 'X'

        # Frame for board
        self.board_frame = tk.Frame(self.root, bg='#5dade2', bd=5, relief='ridge')
        self.board_frame.pack(pady=20)

        # Display turns
        self.turn_label = tk.Label(self.root, text='🔴 Lượt của: X', font=("Arial", 14, "bold"), bg='#d4e6f1', fg='black')
        self.turn_label.pack()

        # Board UI
        self.buttons = []
        for i in range(BOARD_SIZE):
            row_buttons = []
            for j in range(BOARD_SIZE):
                btn = tk.Button(self.board_frame, text="", font=("Arial", 20, "bold"), width=1, height=1, bg='#fdfefe', fg='black', relief='flat', bd=3, command=lambda row=i, col=j: self.make_move(row, col))

                # Hover
                btn.bind("<Enter>", lambda event, b=btn: b.config(bg='#aed6f1'))
                btn.bind("<Leave>", lambda event, b=btn: b.config(bg='#fdfefe'))

                btn.grid(row=i, column=j, padx=2, pady=2)
                row_buttons.append(btn)
            self.buttons.append(row_buttons)
        
        # Buttons frame
        self.button_frame = tk.Frame(self.root, bg='#d4e6f1')
        self.button_frame.pack(pady=10)

        # Reset button
        self.reset_button = self.create_stylish_button("🔃 Chơi lại", self.reset_game, '#1abc9c', '#16a085', 'black')
        self.reset_button.pack(side="left", padx=10)
    
    def create_stylish_button(self, text, command, bg_color, hover_color, text_color):
        """Tạo nút với hiệu ứng hover và thiết kế đẹp"""
        btn = tk.Button(self.button_frame, text=text, font=("Arial", 14, "bold"), command=command, bg=bg_color, fg=text_color, activebackground=hover_color, relief="flat", bd=5, padx=10, pady=5)

        # Hover effect
        btn.bind("<Enter>", lambda event, b=btn: b.config(bg=hover_color))
        btn.bind("<Leave>", lambda event, b=btn: b.config(bg=bg_color))

        return btn

    def center_window(self, window, width, height):
        """Đặt cửa sổ ở giữa màn hình"""
        screen_width = window.winfo_screenwidth()
        screen_height = window.winfo_screenheight()
        x = (screen_width - width) // 2
        y = (screen_height - height) // 2
        window.geometry(f"{width}x{height}+{x}+{y}")

    def make_move(self, row, col):
        """Xử lý nước đi của người chơi"""
        if self.board[row][col] == "":
            self.board[row][col] = self.current_player
            self.buttons[row][col].config(text=self.current_player, fg="red" if self.current_player == "X" else "blue")

            # Check win
            if self.check_winner(row, col):
                self.show_winner_popup()
                return
            
            # Switch turn
            self.current_player = "O" if self.current_player == "X" else "X"
            self.update_turn_label()
    
    def update_turn_label(self):
        """Cập nhật nhãn hiển thị lượt đi"""
        color = "🔴" if self.current_player == "X" else "🔵"
        self.turn_label.config(text=f"{color} Lượt của: {self.current_player}")

    def check_winner(self, row, col):
        """Kiểm tra có 5 ký tự liên tiếp (thắng) không"""
        player = self.board[row][col]

        # Check 4 main directions
        return (self.check_line(row, col, 1, 0, player) or # Vertical
                self.check_line(row, col, 0, 1, player) or # Horizontal
                self.check_line(row, col, 1, 1, player) or # Diagonal to right bottom
                self.check_line(row, col, 1, -1, player))  # Diagonal to left bottom
    
    def check_line(self, row: int, col: int, dr: int, dc: int, player: str) -> bool:
        """
        Kiểm tra xem có ít nhất 5 quân liên tiếp theo một hướng cụ thể hay không

        Thuật toán:
        - Duyệt theo hướng `(dr, dc)`, đếm số quân liên tiếp
        - Duyệt ngược lại `(dr, dc)`, đếm tiếp số quân liên tiếp
        - Nếu tổng số quân liên tiếp >= 5, trả về True

        Args:
            row (int): Chỉ số hàng của ô vừa đánh
            col (int): Chỉ số cột của ô vừa đánh
            dr (int): Hướng di chuyển theo hàng (delta row)
            dc (int): Hướng di chuyển theo cột (delta column)
            player (str): Ký tự đại diện người chơi ('X' hoặc 'O')

        Returns:
            bool: Trả về True nếu có ít nhất 5 quân liên tiếp, ngược lại trả về False
        """

        count = 1 # Consecutive pieces from (rol, col)

        # Direction (dr, dc)
        r, c = row + dr, col + dc
        while 0 <= r < BOARD_SIZE and 0 <= c < BOARD_SIZE and self.board[r][c] == player:
            count += 1
            r += dr
            c += dc
        
        # Opposite direction (-dr, -dc)
        r, c = row - dr, col - dc
        while 0 <= r < BOARD_SIZE and 0 <= c < BOARD_SIZE and self.board[r][c] == player:
            count += 1
            r -= dr
            c -= dc

        
        return count >= 5
    
    def show_winner_popup(self):
        """Tạo cửa sổ đẹp hơn khi có người thắng"""
        popup = Toplevel(self.root)
        popup.title("🎉 Chúc mừng!")
        self.center_window(popup, 350, 200)
        popup.configure(bg="lightyellow")

        frame = tk.Frame(popup, bg="gold", bd=5, relief="ridge")
        frame.pack(padx=10, pady=10, fill="both", expand=True)

        label = Label(frame, text=f"🏆 Người chơi {self.current_player} thắng! 🎉", font=("Arial", 14, "bold"), bg="gold", fg="darkred", padx=10, pady=10)
        label.pack()

        close_button = Button(frame, text="OK", font=("Arial", 12, "bold"), command=lambda: [popup.destroy(), self.reset_game()], bg="red", fg="black", activebackground="darkred", relief="flat", padx=10, pady=5)
        close_button.pack(pady=10)
    
    def reset_game(self):
        """Xóa bàn cờ chơi lại"""
        for i in range(BOARD_SIZE):
            for j in range(BOARD_SIZE):
                self.board[i][j] = ""
                self.buttons[i][j].config(text="", bg="#fdfefe")

        self.current_player = "X"
        self.update_turn_label()
    
root = tk.Tk()
game = CaroGame(root)
root.mainloop()