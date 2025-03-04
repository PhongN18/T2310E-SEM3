# 4.1. Bài tập về lệnh điều kiện
# 1. Kiểm tra số chẵn/lẻ
# n = input("Nhập số nguyên: ")
# try:
#     n = int(n)
#     if n % 2 == 0: print("Chẵn")
#     else: print("Lẻ")
# except:
#     print("Số không hợp lệ")

# 2. Kiểm tra năm nhuận
# y = input("Nhập năm: ")
# try:
#     y = int(y)
#     if y % 400 == 0 or (y % 100 != 0 and y % 4 == 0): print("Năm nhuận")
#     else: print("Năm không nhuận")
# except:
#     print("Năm không hợp lệ")

# 3. Kiểm tra một số có lớn hơn 100 hay không.
# n = input("Nhập số nguyên: ")
# try:
#     n = int(n)
#     if n > 100: print("Lớn hơn 100")
#     else: print("Nhỏ hơn hoặc bằng 100")
# except:
#     print("Số không hợp lệ")

# 4. Tính thuế thu nhập dựa trên mức lương
# taxRate = 10 # 10 phần trăm thuế
# salary = input("Nhập lương: ")
# try:
#     salary = int(salary)
#     print(salary * taxRate / 100)
# except:
#     print("Lương không hợp lệ")

# 5. Xác định học lực dựa trên điểm trung bình
# avg = input("Nhập điểm trung bình: ")
# try:
#     avg = float(avg)
#     if avg > 10 or avg < 0: print("Điểm không hợp lệ")
#     elif avg >= 8.5: print("Giỏi")
#     elif avg >= 7: print("Khá")
#     elif avg >= 5.5: print("Trung bình")
#     else: print("Yếu")
# except:
#     print("Điểm không hợp lệ")

# 6. Kiểm tra xem một số có chia hết cho 3 và 5 không.
# n = input("Nhập số nguyên: ")
# try:
#     n = int(n)
#     if n % 3 == 0 and n % 5 == 0: print("Chia hết cho cả 3 và 5")
#     else: print("Không chia hết")
# except:
#     print("Số không hợp lệ")

# 7. Xác định giai đoạn tuổi
# age = input("Nhập tuổi: ")
# try:
#     age = int(age)
#     if age < 0: print("Tuổi không hợp lệ")
#     elif age <= 16: print("Trẻ em")
#     elif age <= 30: print("Thanh niên")
#     elif age <= 65: print("Người lớn")
#     else: print("Người già")
# except:
#     print("Tuổi không hợp lệ")

# 8. Kiểm tra xem ba số có thể là ba cạnh tam giác không
# try:
#     a, b, c = map(int, input("Nhập ba cạnh tam giác (cách nhau bằng dấu cách): ").split(" "))
#     if a <= 0 or b <= 0 or c <= 0: print("Cạnh tam giác phải là số nguyên dương")
#     elif a + b > c and a + c > b and b + c > a: print("Là tam giác")
#     else: print("Không phải tam giác")
# except:
#     print("Cạnh tam giác phải là số nguyên dương")

# 9. Xác định xem một chữ có là nguyên âm hay phụ âm
# vowels = ['a', 'e', 'i', 'o', 'u']
# c = input("Nhập một chữ cái: ")
# if c.isalpha():
#     if c.lower() in vowels: print("Nguyên âm")
#     else: print("Phụ âm")
# else: print("Chữ cái không hợp lệ")

# 10. Kiểm tra tính hợp lệ của một ngày trong tháng
# try:
#     d, m, y = map(int, input("Nhập ngày, tháng, năm (cách nhau bằng dấu cách): ").split(" "))
#     fullMonths = [1, 3, 5, 7, 8, 10, 12]

#     if d <= 0 or m <= 0 or y <= 0 or d > 31 or m > 12: print("Không hợp lệ")
#     elif (m not in fullMonths and d == 31) or (m == 2 and d > 29): print("Không hợp lệ")
#     elif m == 2 and d == 29 and (y % 4 != 0 or (y % 100 == 0 and y % 400 != 0)): print("Không hợp lệ")
#     else: print("Hợp lệ")

# except:
#     print("Ngày, tháng, năm không hợp lệ")

# 4.2. Bài tập về vòng lặp
# 1. Tính tổng các số từ 1 đến 100
# sum = 0
# for i in range(101): sum += i
# print(sum)

# Tổng các số từ 1 đến n
# n = input("Nhập số nguyên dương: ")
# try:
#     n = int(n)
#     if n == 0 or n == 1: print(n)
#     else:
#         sum = 0
#         for i in range(n + 1): sum += i
#         print(f"Tổng các số từ 1 đến {n} = {sum}")
# except:
#     print("Số không hợp lệ")

# 2. In bảng cửu chương
# n = input("Nhập số nguyên: ")
# try:
#     n = int(n)
#     for i in range(1, 11):
#         print(f"{n} x {i} = {n * i}")
# except:
#     print("Số không hợp lệ")

# 3. Tính giai thừa
# n = input("Nhập số nguyên: ")
# try:
#     n = int(n)
#     if n == 0 or n == 1: print(f"{n}! = 1")
#     elif n == 2: print(f"{n}! = {n}")
#     else:
#         factorial = 1
#         for i in range(2, n + 1):
#             factorial *= i
#         print(f"{n}! = {factorial}")
# except:
#     print("Số không hợp lệ")

# 4. Tính Fibonacci
# n = input("Nhập n: ")
# try:
#     n = int(n)
#     if n <= 0: print("Số không hợp lệ")
#     elif n == 1: print(f"Giá trị Fibonacci thứ 1 = 0")
#     elif n == 2 or n == 3: print(f"Giá trị Fibonacci thứ {n} = 1")
#     else:
#         a = b = 1
#         print("Dãy Fibonacci:")
#         print("0 1 1", end=" ")
#         for i in range(n - 3):
#             a, b = b, a + b
#             print(b, end=" ")
#         print(f"\nGiá trị Fibonacci thứ {n} = {b}")
# except:
#     print("Số không hợp lệ")

# 5. In các số nguyên tố nhỏ hơn n
# n = input("Nhập n: ")
# try:
#     n = int(n)
#     if n <= 0: print("Số không hợp lệ")
#     elif n == 1: print("Không có số nguyên tố nào nhỏ hơn 1")
#     else:
#         for i in range(1, n):
#             isPrime = True
#             for j in range(2, (i // 2) + 1):
#                 if i % j == 0:
#                     isPrime = False
#                     break
#             if isPrime: print(i, end=" ")
# except:
#     print("Số không hợp lệ")

# 6. In hình tam giác
# h = input("Nhập chiều cao tam giác: ")
# try:
#     h = int(h)
#     if h <= 1: print("Chiều cao phải lớn hơn 1")
#     else:
#         for i in range(1, h + 1):
#             print(" " * (h + 1 - i) + "* " * i)

# except:
#     print("Chiều cao phải là số nguyên dương")

# 7. Kiểm tra xem một số có phải là số Armstrong
# n = input("Nhập n: ")
# try:
#     n = int(n)
#     if n <= 0: print("Phải là một số nguyên dương")
#     else:
#         sum, temp = 0, list(map(int, str(n)))
#         for i in temp:
#             sum += i ** (len(temp))
#         if n == sum: print("Là số Armstrong")
#         else: print("Không phải số Armstrong")
# except:
#     print("Số không hợp lệ")

# 8. Ðảo ngược một số
# n = input("Nhập n: ")
# try:
#     n = int(n)
#     if n < 0: print("Phải là một số nguyên lớn hơn 0")
#     elif n < 10: print(f"Đảo ngược: {n}")
#     else:
#         reverse = 0
#         while n > 0:
#             reverse = reverse * 10 + n % 10
#             n //= 10
#         print(f"Đảo ngược: {reverse}")
# except:
#     print("Số không hợp lệ")

# 9. Tính tổng các chữ số của một số
# n = input("Nhập n: ")
# try:
#     n = int(n)
#     if n < 0: print("Phải là một số nguyên lớn hơn 0")
#     elif n < 10: print(f"Tổng: {n}")
#     else:
#         sum = 0
#         while n > 0:
#             sum += n % 10
#             n //= 10
#         print(f"Tổng: {sum}")
# except:
#     print("Số không hợp lệ")

# 10. Tính số lần xuất hiện của từ trong câu
s = input("Nhập chuỗi: ")
word = input("Nhập từ muốn tìm: ")

i = count = 0
while i <= len(s) - len(word):
    index = s.find(word, i)
    if index != -1:
        count += 1
        i = index + 1
    else:
        break
print(count)