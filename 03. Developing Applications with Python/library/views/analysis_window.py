import tkinter as tk
import pandas as pd
import matplotlib.pyplot as plt
from pymongo import MongoClient
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
import numpy as np

class AnalysisWindow:
    def __init__(self, root):
        self.window = tk.Toplevel(root)
        self.window.title("Data Analysis")
        self.window.geometry("600x400")
        self.window.transient(root)  # Đảm bảo luôn nằm trên cửa sổ Manage
        self.window.grab_set()  # Giữ focus trên cửa sổ này

        tk.Label(self.window, text="Data Analysis", font=("Arial", 16, "bold")).pack(pady=20)

        # Nút tạo dữ liệu mẫu
        tk.Button(self.window, text="Create Sample Data", command=self.create_sample_data).pack(pady=5)

        # Nút phân tích doanh thu theo thể loại
        tk.Button(self.window, text="Revenue by Genre", command=self.show_revenue_by_genre).pack(pady=5)

        # Nút phân tích số lượng bán theo thể loại
        tk.Button(self.window, text="Sales Count by Genre", command=self.show_sales_count_by_genre).pack(pady=5)

        # Nút dự đoán doanh thu trong tương lai
        tk.Button(self.window, text="Predict Future Revenue", command=self.predict_future_revenue).pack(pady=5)

        # Nút dự đoán số lượng bán trong tương lai
        tk.Button(self.window, text="Predict Future Sales Count", command=self.predict_future_sales_count).pack(pady=5)

    def get_data(self):
        """Lấy dữ liệu từ MongoDB."""
        client = MongoClient("mongodb://localhost:27017/")
        db = client["library_manager"]
        collection = db["books"]
        books = list(collection.find())
        return pd.DataFrame(books)

    def plot_bar_chart(self, data, title, xlabel, ylabel, color):
        plt.figure()
        ax = data.plot(kind="barh", color=color)  # Đổi trục thành ngang

        # Thiết lập tiêu đề và nhãn
        plt.title(title, fontsize=16, fontweight='bold')
        plt.xlabel(xlabel, fontsize=14)
        plt.ylabel(ylabel, fontsize=14)

        # Bỏ thanh viền trên cùng và bên phải
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)

        if title == "Revenue by Genre":
            # Định dạng trục X để hiển thị tiền tệ VND
            ax.get_xaxis().set_major_formatter(plt.FuncFormatter(lambda x, _: f"{int(x // 1000000):,}"))

            # Hiển thị giá trị trên thanh
            for index, value in enumerate(data):
                ax.text(value, index, f"{int(value):,} VND", va='center')
        else:
            for index, value in enumerate(data):
                ax.text(value, index, f"{int(value)}", va='center')

        plt.tight_layout()
        plt.show()

    def format_currency(self, value):
        """Định dạng số thành tiền VND có dấu phẩy."""
        return f"{int(value):,} VND"

    def show_revenue_by_genre(self):
        """Hiển thị biểu đồ doanh thu theo thể loại."""
        df = self.get_data()
        revenue_by_genre = df.groupby("genre")["sales_revenue"].sum().sort_values()
        self.plot_bar_chart(revenue_by_genre, "Revenue by Genre", "Revenue (VND)", "", "orange")

    def show_sales_count_by_genre(self):
        """Hiển thị biểu đồ số lượng bán theo thể loại."""
        df = self.get_data()
        sales_count_by_genre = df.groupby("genre")["sales_count"].sum().sort_values()
        self.plot_bar_chart(sales_count_by_genre, "Sales Count by Genre", "Sales Count", "", "blue")

    def predict_future(self, y, label):
        df = self.get_data()
        df['date'] = pd.to_datetime(df['last_sold_date'])

        # Tạo cột 'month' dưới dạng chuỗi "mm/yyyy"
        df['month'] = df['date'].dt.strftime('%m/%Y')

        # Nhóm theo tháng và tính tổng doanh thu hoặc số lượng bán
        monthly_data = df.groupby('month')[y.name].sum().reset_index()

        # Chuyển đổi tháng sang số tháng kể từ gốc (tháng 3/2025)
        base_month = pd.Period("2025-03", freq='M')
        monthly_data['month_number'] = monthly_data['month'].apply(lambda x: (pd.Period(x, freq='M') - base_month).n)

        X = monthly_data[['month_number']]
        y = monthly_data[y.name]

        # Mô hình đa thức để tạo ra dự đoán có biến động
        poly = PolynomialFeatures(degree=3)
        X_poly = poly.fit_transform(X)

        model = LinearRegression()
        model.fit(X_poly, y)

        # Dự đoán trong 12 tháng tiếp theo
        future_months = np.array(range(X['month_number'].max() + 1, X['month_number'].max() + 13)).reshape(-1, 1)
        future_months_poly = poly.transform(future_months)
        predictions = model.predict(future_months_poly)

        # Tạo biến động ngẫu nhiên
        noise = np.random.normal(0, np.std(predictions) * 0.1, len(predictions))
        predictions += noise

        # Định dạng trục ngang (tháng) để hiển thị từ gốc
        future_labels = [(base_month + i).strftime("%m/%Y") for i in future_months.flatten()]

        plt.figure()
        plt.plot(future_labels, predictions, label=f"Predicted {label}", color="purple", linewidth=2)
        plt.title(f"Predicted Future {label}", fontsize=16, fontweight='bold')
        plt.xlabel("Month", fontsize=14)

        # Định dạng trục dọc cho doanh thu (VND)
        if label == "Revenue (VND)":
            plt.ylabel(label, fontsize=14)
            plt.gca().get_yaxis().set_major_formatter(plt.FuncFormatter(lambda x, _: f"{int(x):,} VND"))
        else:
            plt.ylabel(label, fontsize=14)

        # Nghiêng nhãn trục X để không bị đè
        plt.xticks(rotation=45)

        plt.grid(True, linestyle="--", alpha=0.7)
        plt.tight_layout()
        plt.show()

    def predict_future_revenue(self):
        """Dự đoán doanh thu trong tương lai."""
        df = self.get_data()
        y = df['sales_revenue']
        self.predict_future(y, "Revenue (VND)")

    def predict_future_sales_count(self):
        """Dự đoán số lượng bán trong tương lai."""
        df = self.get_data()
        y = df['sales_count']
        self.predict_future(y, "Sales Count")

    def create_sample_data(self):
        """Khởi tạo dữ liệu mẫu 100 sách."""
        client = MongoClient("mongodb://localhost:27017/")
        db = client["library_manager"]
        collection = db["books"]
        collection.delete_many({})  # Xóa dữ liệu cũ

        genres = ["Fiction", "Non-Fiction", "Science", "Romance", "Adventure", "Mystery", "Fantasy", "Biography", "Historical", "Self-Help"]

        books = []
        start_date = datetime(2024, 1, 1)
        for i in range(1, 101):
            date_offset = np.random.randint(0, 365)
            last_sold_date = start_date + timedelta(days=date_offset)
            sales_count = np.random.randint(50, 500)
            price = round(np.random.randint(100, 501) * 1000, -3)
            revenue = round(sales_count * price * np.random.uniform(0.8, 1.2), -3)

            book = {
                "title": f"Book Title {i}",
                "author": f"Author {i}",
                "genre": np.random.choice(genres),
                "image_path": f"images/books/book{i}.jpg",
                "sales_count": sales_count,
                "sales_revenue": revenue,
                "last_sold_date": last_sold_date,
                "added_date": start_date + timedelta(days=np.random.randint(0, 30)),
                "price": price
            }
            books.append(book)

        collection.insert_many(books)
        tk.messagebox.showinfo("Success", "Sample data created successfully!")
