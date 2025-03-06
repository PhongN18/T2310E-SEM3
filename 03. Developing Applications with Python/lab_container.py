# Bài tập 1: Quản lý danh sách nhân viên
# employee_list = ['Nam', 'Linh', 'Minh']

# def display_employees():
#     if not employee_list:
#         print("Danh sách nhân viên rỗng.")
#     else:
#         print("Danh sách nhân viên:")
#         for idx, employee in enumerate(employee_list, 1):
#             print(f"{idx}. {employee}")

# def add_employee():
#     name = input("Nhập tên nhân viên: ")
#     employee_list.append(name)
#     print(f"Đã thêm nhân viên {name} vào danh sách.")

# def remove_employee():
#     display_employees()
#     try:
#         idx = int(input("Nhập số thứ tự nhân viên cần xóa: ")) - 1
#         if 0 <= idx < len(employee_list):
#             removed = employee_list.pop(idx)
#             print(f"Đã xóa nhân viên {removed} khỏi danh sách.")
#         else:
#             print("Số thứ tự không hợp lệ.")
#     except ValueError:
#         print("Vui lòng nhập một số hợp lệ.")

# def manage_employees():
#     while True:
#         print("\n1. Hiển thị danh sách nhân viên")
#         print("2. Thêm nhân viên")
#         print("3. Xóa nhân viên")
#         print("4. Thoát")
#         choice = input("Chọn hành động: ")

#         if choice == '1':
#             display_employees()
#         elif choice == '2':
#             add_employee()
#         elif choice == '3':
#             remove_employee()
#         elif choice == '4':
#             print("Thoát chương trình.")
#             break
#         else:
#             print("Lựa chọn không hợp lệ. Vui lòng chọn lại.")

# manage_employees()

# Bài tập 2: Danh sách số nguyên tố (Tuple)
# def is_prime(num):
#     if num < 2:
#         return False
#     for i in range(2, int(num ** 0.5) + 1):
#         if num % i == 0:
#             return False
#     return True

# prime_numbers = tuple(num for num in range(1, 51) if is_prime(num))

# print("Danh sách các số nguyên tố từ 1 đến 50:", prime_numbers)

# Bài tập 3: Quản lý các sản phẩm không trùng lặp (Set)
# products = set()

# def add_product(product):
#     if product in products:
#         print(f"Sản phẩm '{product}' đã tồn tại trong danh sách.")
#     else:
#         products.add(product)
#         print(f"Đã thêm sản phẩm '{product}' vào danh sách.")

# def display_products():
#     if not products:
#         print("Danh sách sản phẩm rỗng.")
#     else:
#         print("Danh sách sản phẩm cửa hàng:")
#         for product in products:
#             print(product)

# def manage_products():
#     while True:
#         print("\n1. Hiển thị danh sách sản phẩm")
#         print("2. Thêm sản phẩm")
#         print("3. Thoát")
#         choice = input("Chọn hành động: ")

#         if choice == '1':
#             display_products()
#         elif choice == '2':
#             product_name = input("Nhập tên sản phẩm: ")
#             add_product(product_name)
#         elif choice == '3':
#             print("Thoát chương trình.")
#             break
#         else:
#             print("Lựa chọn không hợp lệ. Vui lòng chọn lại.")

# manage_products()

# Bài tập 4: Sắp xếp danh sách học sinh theo điểm
# def input_students():
#     students = {}
#     while True:
#         name = input("Nhập tên học sinh (hoặc gõ 'dừng' để kết thúc): ")
#         if name.lower() == 'dừng':
#             break
#         try:
#             score = float(input(f"Nhập điểm của {name}: "))
#             students[name] = score
#         except ValueError:
#             print("Vui lòng nhập điểm hợp lệ.")
#     return students

# def sort_students_by_score(students):
#     sorted_students = sorted(students.items(), key=lambda student: student[1], reverse=True)
#     print("\nDanh sách học sinh sau khi sắp xếp theo điểm (cao đến thấp):")
#     for i, (name, score) in enumerate(sorted_students, 1):
#         print(f"{i}. {name}: {score}")

# def main():
#     students = input_students()
#     if students:
#         sort_students_by_score(students)
#     else:
#         print("Không có học sinh nào được nhập.")

# main()

# Bài tập 5: Ðếm số lần xuất hiện của từ trong văn bản (Dictionary)
# Nhập một đoạn văn, đếm số lần xuất hiện của từng từ
# def count_word_frequency(text):
#     words = text.lower().split()
    
#     word_count = {}
    
#     for word in words:
#         word = word.strip(",.!?\"';:")
        
#         if word in word_count:
#             word_count[word] += 1
#         else:
#             word_count[word] = 1
    
#     return word_count

# def main():
#     text = input("Nhập đoạn văn: ")
#     word_count = count_word_frequency(text)
#     print("\nSố lần xuất hiện của từng từ trong đoạn văn:")
#     for word, count in word_count.items():
#         print(f"'{word}': {count}")

# main()

# Bài tập 6: Xử lý dữ liệu log truy cập (Set)
# Cho danh sách IP truy cập vào hệ thống, lọc ra danh sách IP duy nhất.
# def main():
#     ip_list = input("Nhập danh sách IP (cách nhau bằng dấu cách): ").split()
#     unique_ips = set(ip_list)
    
#     print("\nDanh sách các IP duy nhất:")
#     for ip in unique_ips:
#         print(ip)

# main()

# Bài tập 7: Hệ thống hàng đợi khách hàng (Queue)
# Viết chương trình mô phỏng hệ thống hàng đợi khách hàng, phục vụ lần lượt
# from collections import deque

# def serve_customer(queue):
#     if queue:
#         customer = queue.popleft()
#         print(f"Đang phục vụ khách hàng: {customer}")
#     else:
#         print("Không có khách hàng trong hàng đợi.")

# def main():
#     queue = deque()
    
#     while True:
#         print("\n1. Thêm khách hàng vào hàng đợi")
#         print("2. Phục vụ khách hàng")
#         print("3. Xem danh sách khách hàng trong hàng đợi")
#         print("4. Thoát")
#         choice = input("Chọn hành động: ")

#         if choice == '1':
#             customer_name = input("Nhập tên khách hàng: ")
#             queue.append(customer_name)
#             print(f"Đã thêm {customer_name} vào hàng đợi.")
#         elif choice == '2':
#             serve_customer(queue)
#         elif choice == '3':
#             if queue:
#                 print("\nDanh sách khách hàng trong hàng đợi:")
#                 for customer in queue:
#                     print(customer)
#             else:
#                 print("Hàng đợi trống.")
#         elif choice == '4':
#             print("Thoát chương trình.")
#             break
#         else:
#             print("Lựa chọn không hợp lệ. Vui lòng chọn lại.")

# main()

# Bài tập 8: Danh sách công việc ưu tiên (List + Sort)
# Nhập danh sách công việc và mức độ ưu tiên, sắp xếp theo mức độ ưu tiên.
# def input_tasks():
#     tasks = []
#     while True:
#         task_name = input("Nhập tên công việc (hoặc gõ 'dừng' để kết thúc): ")
#         if task_name.lower() == 'dừng':
#             break
#         try:
#             priority = int(input(f"Nhập mức độ ưu tiên cho công việc '{task_name}' (1 là cao nhất): "))
#             tasks.append((task_name, priority))
#         except ValueError:
#             print("Vui lòng nhập mức độ ưu tiên hợp lệ.")
#     return tasks

# def sort_tasks_by_priority(tasks):
#     tasks.sort(key=lambda task: task[1])
#     print("\nDanh sách công việc sau khi sắp xếp theo mức độ ưu tiên:")
#     for i, (task, priority) in enumerate(tasks, 1):
#         print(f"{i}. {task} - Ưu tiên: {priority}")

# def main():
#     tasks = input_tasks()
#     if tasks:
#         sort_tasks_by_priority(tasks)
#     else:
#         print("Không có công việc nào được nhập.")

# main()

#  Bài tập 9: Chuyển đổi danh sách thành từ điển
# Nhập danh sách cặp (tên, điểm), chuyển thành dictionary.
# def input_pairs():
#     pairs = []
#     while True:
#         name = input("Nhập tên học sinh (hoặc gõ 'dừng' để kết thúc): ")
#         if name.lower() == 'dừng':
#             break
#         try:
#             score = float(input(f"Nhập điểm của {name}: "))
#             pairs.append((name, score))
#         except ValueError:
#             print("Vui lòng nhập điểm hợp lệ.")
#     return pairs

# def convert_to_dict(pairs):
#     return dict(pairs)

# def main():
#     pairs = input_pairs()
#     if pairs:
#         result_dict = convert_to_dict(pairs)
#         print("\nTừ điển tên và điểm:")
#         print(result_dict)
#     else:
#         print("Không có dữ liệu để chuyển thành từ điển.")

# main()

# Bài tập 10: Thống kê số lượng sản phẩm bán ra
# Nhập danh sách sản phẩm đã bán, đếm số lượng mỗi sản phẩm bán ra bằng dictionary
def input_sales():
    sales = []
    while True:
        product = input("Nhập tên sản phẩm đã bán (hoặc gõ 'dừng' để kết thúc): ")
        if product.lower() == 'dừng':
            break
        sales.append(product)
    return sales

def count_sales(sales):
    sales_count = {}
    for product in sales:
        if product in sales_count:
            sales_count[product] += 1
        else:
            sales_count[product] = 1
    return sales_count

def main():
    sales = input_sales()
    if sales:
        sales_count = count_sales(sales)
        print("\nSố lượng mỗi sản phẩm bán ra:")
        for product, count in sales_count.items():
            print(f"{product}: {count}")
    else:
        print("Không có sản phẩm nào được nhập.")

main()