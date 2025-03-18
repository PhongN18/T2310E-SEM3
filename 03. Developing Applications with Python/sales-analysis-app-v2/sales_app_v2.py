import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from ttkthemes import ThemedTk
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from prophet import Prophet
def load_csv():
    file_path = filedialog.askopenfilename(filetypes=[("CSV files", "*.csv")])
    if file_path:
        try:
            global df
            df = pd.read_csv(file_path)
            status_label.config(text=f"Đã tải: {file_path.split('/')[-1]} | {len(df)} bản ghi")
            analyze_button.config(state="normal")
            predict_button.config(state="normal")
        except Exception as e:
            messagebox.showerror("Lỗi", f"Không thể tải file: {e}")
def change_theme(theme_name):
    root.set_theme(theme_name)
    root.update()
def analyze_data():
    if 'df' not in globals():
        messagebox.showwarning("Cảnh báo", "Vui lòng tải file CSV trước!")
        return
    analysis_window = tk.Toplevel(root)
    analysis_window.title("Phân tích dữ liệu bán hàng")
    analysis_window.geometry("1000x800")
    stats_frame = ttk.LabelFrame(analysis_window, text="Thống kê cơ bản", padding=10)
    stats_frame.pack(fill="x", padx=10, pady=5)
    stats = df.describe().to_string()
    stats_text = tk.Text(stats_frame, height=8, width=80, font=("Helvetica", 10))
    stats_text.insert(tk.END, stats)
    stats_text.pack()

    if 'ds' in df.columns and 'y' in df.columns:
        df['ds'] = pd.to_datetime(df['ds'])
        # Biểu đồ xu hướng tổng quát
        trend_frame = ttk.LabelFrame(analysis_window, text="Xu hướng doanh thu", padding=10)
        trend_frame.pack(fill="x", padx=10, pady=5)
        fig1, ax1 = plt.subplots(figsize=(9, 3))
        df.plot(x='ds', y='y', ax=ax1, title="Doanh thu theo thời gian", color="#1f77b4")
        ax1.set_xlabel("Ngày", fontsize=10)
        ax1.set_ylabel("Doanh thu", fontsize=10)
        plt.xticks(rotation=45)
        canvas1 = FigureCanvasTkAgg(fig1, master=trend_frame)
        canvas1.draw()
        canvas1.get_tk_widget().pack()
        # Xu hướng theo tháng
        monthly_frame = ttk.LabelFrame(analysis_window, text="Doanh thu trung bình theo tháng", padding=10)
        monthly_frame.pack(fill="x", padx=10, pady=5)
        df['month'] = df['ds'].dt.month
        monthly_avg = df.groupby('month')['y'].mean()
        fig2, ax2 = plt.subplots(figsize=(9, 3))
        monthly_avg.plot(kind='bar', ax=ax2, title="Doanh thu trung bình theo tháng", color="#2ca02c")
        ax2.set_xlabel("Tháng", fontsize=10)
        ax2.set_ylabel("Doanh thu trung bình", fontsize=10)
        canvas2 = FigureCanvasTkAgg(fig2, master=monthly_frame)
        canvas2.draw()
        canvas2.get_tk_widget().pack()
        # Trung bình động
        ma_frame = ttk.LabelFrame(analysis_window, text="Trung bình động 30 ngày", padding=10)
        ma_frame.pack(fill="x", padx=10, pady=5)
        df['ma_30'] = df['y'].rolling(window=30, min_periods=1).mean()
        fig3, ax3 = plt.subplots(figsize=(9, 3))
        df.plot(x='ds', y='ma_30', ax=ax3, title="Trung bình động 30 ngày", color="#d62728")
        ax3.set_xlabel("Ngày", fontsize=10)
        ax3.set_ylabel("Doanh thu", fontsize=10)
        plt.xticks(rotation=45)
        canvas3 = FigureCanvasTkAgg(fig3, master=ma_frame)
        canvas3.draw()
        canvas3.get_tk_widget().pack()
    else:
        messagebox.showwarning("Cảnhh báo", "File CSV cần có cột 'ds' và 'y'!")
def predict_sales():
    if 'df' not in globals():
        messagebox.showwarning("Cảnh báo", "Vui lòng tải file CSV trước!")
        return
    if 'ds' not in df.columns or 'y' not in df.columns:
        messagebox.showwarning("Cảnh báo", "File CSV cần có cột 'ds' và 'y'!")
        return
    df['ds'] = pd.to_datetime(df['ds'])
    model = Prophet(yearly_seasonality=True, weekly_seasonality=True, daily_seasonality=False)
    model.fit(df)
    future = model.make_future_dataframe(periods=30)
    forecast = model.predict(future)
    predict_window = tk.Toplevel(root)
    predict_window.title("Dự đoán doanh thu")
    predict_window.geometry("1000x800")
    # Biểu đồ dự đoán
    plot_frame = ttk.LabelFrame(predict_window, text="Dự đoán doanh thu 30 ngày", padding=10)
    plot_frame.pack(fill="x", padx=10, pady=5)
    fig, ax = plt.subplots(figsize=(9, 4))
    ax.plot(df['ds'], df['y'], label="Doanh thu thực tê ́", color="#1f77b4")
    ax.plot(forecast['ds'], forecast['yhat'], label="Dự đoán", color="#ff7f0e", linestyle="--")
    ax.fill_between(forecast['ds'], forecast['yhat_lower'], forecast['yhat_upper'], color='gray', alpha=0.2, label="Khoảng tin cậy")
    ax.set_xlabel("Ngày", fontsize=10)
    ax.set_ylabel("Doanh thu", fontsize=10)
    ax.legend()
    plt.xticks(rotation=45)
    canvas = FigureCanvasTkAgg(fig, master=plot_frame)
    canvas.draw()
    canvas.get_tk_widget().pack()
    # Bảng kết quả
    result_frame = ttk.LabelFrame(predict_window, text="Kết quả dự đoán (30 ngày cuối)", padding=10)
    result_frame.pack(fill="x", padx=10, pady=5)
    result_tree = ttk.Treeview(result_frame, columns=("Ngày", "Dự đoán", "Thấp nhất", "Cao nhất"), show="headings", height=8)
    result_tree.heading("Ngày", text="Ngày")
    result_tree.heading("Dự đoán", text="Dự đoán")
    result_tree.heading("Thấp nhất", text="Thấp nhất")
    result_tree.heading("Cao nhất", text="Cao nhất")
    for i, row in forecast.tail(30).iterrows():
        result_tree.insert("", "end", values=(row['ds'].strftime('%Y-%m-%d'), f"{row['yhat']:.2f}", f"{row['yhat_lower']:.2f}", f"{row['yhat_upper']:.2f}"))
    result_tree.pack()

# Nút xuất CSV
def export_forecast():
    forecast.tail(30)[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].to_csv('forecast_output.csv', index=False)
    messagebox.showinfo("Thông báo", "Đã xuất dự đoán ra 'forecast_output.csv'")
    export_button = ttk.Button(predict_window, text="Xuất dự đoán ra CSV", command=export_forecast)
    export_button.pack(pady=10)

# Giao diện chính
root = ThemedTk(theme="arc")
root.title("Phân tích & Dự đoán dữ liệu bán hàng (v2)")
root.geometry("700x500")
root.configure(bg="#f5f6f5")
# Menu tùy chỉnh theme
menu_bar = tk.Menu(root)
root.config(menu=menu_bar)
theme_menu = tk.Menu(menu_bar, tearoff=0)
menu_bar.add_cascade(label="Giao diện", menu=theme_menu)
themes = ["arc", "breeze", "equilux", "radiance"]
for theme in themes:
    theme_menu.add_command(label=theme.capitalize(), command=lambda t=theme: change_theme(t))
main_frame = ttk.Frame(root)
main_frame.pack(expand=True, fill="both", padx=20, pady=20)
title_label = ttk.Label(main_frame, text="Ứng dụng phân tích dữ liệu bán hàng", font=("Helvetica", 18, "bold"))
title_label.pack(pady=20)
button_frame = ttk.Frame(main_frame)
button_frame.pack(expand=True)
load_button = ttk.Button(button_frame, text="Tải file CSV", command=load_csv, style="Accent.TButton")
load_button.pack(pady=10)
analyze_button = ttk.Button(button_frame, text="Phân tích dữ liệu", command=analyze_data, state="disabled", style="Accent.TButton")
analyze_button.pack(pady=10)
predict_button = ttk.Button(button_frame, text="Dự đoán doanh thu", command=predict_sales, state="disabled", style="Accent.TButton")
predict_button.pack(pady=10)
status_label = ttk.Label(main_frame, text="Chưa tải file nào", font=("Helvetica", 10, "italic"))
status_label.pack(pady=10)
root.mainloop()