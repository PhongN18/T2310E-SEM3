import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import numpy as np
def load_csv():
    file_path = filedialog.askopenfilename(filetypes=[("CSV files","*.csv")])
    if file_path:
        try:
            global df
            df = pd.read_csv(file_path)
            lbl_status.config(text=f"Đã tải: {file_path.split('/')[-1]} | {len(df)} bản ghi")
            btn_analyze.config(state="normal")
            btn_predict.config(state="normal")
        except Exception as e:
            messagebox.showerror("Lỗi", f"Không thể tải file: {e}")

def analyze_data():
    if 'df' not in globals():
        messagebox.showwarning("Cảnh báo", "Vui lòng tải file CSV trước!")
        return
    analysis_window = tk.Toplevel(root)
    analysis_window.title("Phân tích dữ liệu bán hàng")
    analysis_window.geometry("800x600")
    analysis_window.configure(bg="#f0f0f0")
    stats = df.describe().to_string()
    stats_label = tk.Label(analysis_window, text="Thống kê cơ bản:", font=("Arial", 12, "bold"), bg="#f0f0f0")
    stats_label.pack(pady=5)
    stats_text = tk.Text(analysis_window, height=10, width=80)
    stats_text.insert(tk.END, stats)
    stats_text.pack(pady=5)
    
    if 'Sales' in df.columns and 'Date' in df.columns:
        fig, ax = plt.subplots(figsize=(8, 4))
        df.plot(x='Date', y='Sales', ax=ax, title="Doanh thu theo thời gian", color="blue")
        ax.set_xlabel("Ngày")
        ax.set_ylabel("Doanh thu")
        plt.xticks(rotation=45)
        canvas = FigureCanvasTkAgg(fig, master=analysis_window)
        canvas.draw()
        canvas.get_tk_widget().pack(pady=10)
    else:
        messagebox.showwarning("Cảnh báo", "File CSV cần có cột 'Date' và 'Sales'!")
def predict_sales():
    if 'df' not in globals():
        messagebox.showwarning("Cảnh báo", "Vui lòng tải file CSV trước!")
        return
    if 'Sales' not in df.columns or 'Date' not in df.columns:
        messagebox.showwarning("Cảnh báo", "File CSV cần có cột 'Date' và 'Sales'!")
        return
    df['Date'] = pd.to_datetime(df['Date'])
    df['Days'] = (df['Date'] - df['Date'].min()).dt.days
    X = df[['Days']]
    y = df['Sales']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = LinearRegression()
    model.fit(X_train, y_train)
    score = model.score(X_test, y_test)
    last_day = df['Days'].max()
    future_days = np.array(range(last_day + 1, last_day + 31)).reshape(-1, 1)
    predictions = model.predict(future_days)
    predict_window = tk.Toplevel(root)
    predict_window.title("Dự đoán doanh thu")
    predict_window.geometry("800x600")
    predict_window.configure(bg="#f0f0f0")
    result_label = tk.Label(predict_window, text=f"Độ chính xác mô hình: {score:.2%}", font=("Arial", 12, "bold"), bg="#f0f0f0")
    result_label.pack(pady=5)
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.plot(df['Days'], df['Sales'], label="Doanh thu thực tế ́", color="blue")
    ax.plot(future_days, predictions, label="Dự đoán 30 ngày", color="red", linestyle="--")
    ax.set_title("Dự đoán doanh thu")
    ax.set_xlabel("Số ngày")
    ax.set_ylabel("Doanh thu")
    ax.legend()
    canvas = FigureCanvasTkAgg(fig, master=predict_window)
    canvas.draw()
    canvas.get_tk_widget().pack(pady=10)

root = tk.Tk()
root.title("Phân tích & Dự đoán dữ liệu bán hàng")
root.geometry("600x400")
root.configure(bg="#e0e0e0")
title_label = tk.Label(root, text="Ứng dụng phân tích dữ liệu bán hàng", font=("Arial", 16, "bold"), bg="#e0e0e0", fg="#333333")
title_label.pack(pady=20)
btn_load = ttk.Button(root, text="Tải file CSV", command=load_csv)
btn_load.pack(pady=10)
lbl_status = tk.Label(root, text="Chưa tải file nào", font=("Arial", 10), bg="#e0e0e0", fg="#666666")
lbl_status.pack(pady=5)
btn_analyze = ttk.Button(root, text="Phân tích dữ liệu", command=analyze_data, state="disabled")
btn_analyze.pack(pady=10)
btn_predict = ttk.Button(root, text="Dự đoán doanh thu", command=predict_sales, state="disabled")
btn_predict.pack(pady=10)
root.mainloop()