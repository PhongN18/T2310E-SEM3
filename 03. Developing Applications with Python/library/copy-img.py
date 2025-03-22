import os
import random
import shutil

# Đường dẫn đến thư mục chứa ảnh gốc
source_dir = "images/books"
files = [f for f in os.listdir(source_dir) if f.startswith("book") and f.endswith(".jpg")]

# Kiểm tra xem đã có đủ 20 ảnh gốc chưa
if len(files) < 20:
    print(f"Chỉ tìm thấy {len(files)} ảnh gốc, cần ít nhất 20 ảnh.")
    exit()

# Tạo 80 ảnh copy với tên ngẫu nhiên từ book21 đến book100
for i in range(21, 101):
    # Chọn ngẫu nhiên một ảnh từ danh sách 20 ảnh gốc
    source_file = random.choice(files)
    dest_file = f"book{i}.jpg"
    dest_path = os.path.join(source_dir, dest_file)

    # Copy ảnh với tên mới
    shutil.copy(os.path.join(source_dir, source_file), dest_path)
    print(f"Tạo ảnh: {dest_file} từ {source_file}")

print("Tạo 80 ảnh copy thành công!")
