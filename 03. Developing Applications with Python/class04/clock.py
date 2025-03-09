import tkinter as tk
import math
import time

class Clock(tk.Canvas):
    def __init__(self, parent):
        super().__init__(parent, width=200, height=200, bg="white")
        self.pack()
        self.update_clock()  # Bắt đầu cập nhật đồng hồ

    def update_clock(self):
        """Cập nhật kim đồng hồ với hiệu ứng trôi mượt."""
        self.delete("all")  # Xóa nội dung cũ
        self.draw_face()  # Vẽ mặt đồng hồ

        # Lấy thời gian hiện tại với độ chính xác cao
        current_time = time.time()
        local_time = time.localtime(current_time)

        hour = local_time.tm_hour
        minute = local_time.tm_min
        second = local_time.tm_sec + (current_time % 1)  # Thêm phần thập phân để kim trôi mượt

        # Vẽ kim đồng hồ với hiệu ứng mượt
        self.draw_hand(hour % 12 * 30 + minute * 0.5 - 90, 50, "black", 3)  # Kim giờ (mỗi giờ = 30°, mỗi phút = 0.5°)
        self.draw_hand(minute * 6 + second * 0.1 - 90, 70, "blue", 2)  # Kim phút (mỗi phút = 6°, mỗi giây = 0.1°)
        self.draw_hand(second * 6 - 90, 80, "red", 1)  # Kim giây (mỗi giây = 6°)

        # Cập nhật sau mỗi 50ms để kim trôi mượt
        self.after(50, self.update_clock)

    def draw_face(self):
        """Vẽ mặt đồng hồ và các số từ 1-12."""
        self.create_oval(10, 10, 190, 190, width=2)  # Vẽ vòng tròn
        center_x, center_y = 100, 100  

        for i in range(1, 13):  # Vẽ số trên mặt đồng hồ
            angle = math.radians(i * 30 - 90)
            x = center_x + 80 * math.cos(angle)
            y = center_y + 80 * math.sin(angle)
            self.create_text(x, y, text=str(i), font=("Arial", 12, "bold"))

    def draw_hand(self, angle_deg, length, color, width):
        """Vẽ kim đồng hồ dựa trên góc quay."""
        angle_rad = math.radians(angle_deg)
        x_end = 100 + length * math.cos(angle_rad)
        y_end = 100 + length * math.sin(angle_rad)
        self.create_line(100, 100, x_end, y_end, width=width, fill=color)

# Chạy ứng dụng
root = tk.Tk()
root.title("Smooth Clock")
clock = Clock(root)
root.mainloop()
