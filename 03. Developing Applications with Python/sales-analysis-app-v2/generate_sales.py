import pandas as pd
import numpy as np
from datetime import datetime, timedelta
def generate_sales_data(num_records=1000):
    start_date = datetime(2022, 1, 1)
    dates = [start_date + timedelta(days=i) for i in range(num_records)]
    base_sales = 500
    sales = []
    for i in range(num_records):
        day_of_year = (dates[i] - datetime(dates[i].year, 1, 1)).days
        # Mùa vụ năm: cao tháng 4-6, thấp tháng 10-12
        seasonal_factor = 300 * np.sin(2 * np.pi * (day_of_year - 90) / 365)  # Dịch đỉnh về tháng 5
        # Chu kỳ học kỳ (3 tháng)
        semester_factor = 100 * np.sin(2 * np.pi * i / 90) # Nhiễu ngẫu nhiên
        noise = 150 * np.random.normal(0, 1)
        sales.append(base_sales + seasonal_factor + semester_factor + noise)
    df = pd.DataFrame({'ds': dates, 'y': sales})
    df['ds'] = df['ds'].dt.strftime('%Y-%m-%d')
    df.to_csv('sales_data.csv', index=False)
    print(f"Đã tạo file 'sales_data.csv' với {num_records} bản ghi.")
generate_sales_data(1000)