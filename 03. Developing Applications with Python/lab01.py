# 1. Khai báo và in giá trị của một biến kiểu int, float, str, bool.
# x = 10 # Biến kiểu số nguyên (int)
# y = 3.14 # Biến kiểu số thực (float)
# name = "Python" # Biến kiểu chuỗi (string)
# flag = True # Biến kiểu boolean
# print(x, y, name, flag)

# 2. Nhập hai số nguyên từ bàn phím và tính tổng của chúng.
# a, b = map(int, input("Nhập hai số (cách nhau bởi dấu cách): ").split())
# print(a + b)

# 3. Nhập một số nguyên và kiểm tra nó là số chẵn hay lẻ.
# c = int(input("Nhập số nguyên: "))
# print('Chẵn' if c % 2 == 0 else 'Lẻ')

# 4. Tính diện tích hình chữ nhật với chiều dài và chiều rộng nhập vào
# cd, cr = map(int, input("Nhập chiều dài, chiều rộng (cách nhau bởi dấu cách): ").split())
# print("Diện tích =", cd * cr)

# 5. Kiểm tra số nhập vào có phải là số nguyên tố không
# n = int(input("Nhập số nguyên: "))
# isPrime = True
# for i in range(2, int(n / 2)):
#     if n % i == 0:
#         isPrime = False
#         break

# print("Số nguyên tố" if isPrime else "Không phải số nguyên tố")

# 6. Viết chương trình kiểm tra một số có chia hết cho 3 không
# n = int(input("Nhập số nguyên: "))
# print("Chia hết cho 3" if n % 3 == 0 else "Không chia hết cho 3")

# 7. Tính tổng các chữ số của một số nguyên
# n = int(input("Nhập số nguyên: "))
# res = 0
# while n > 0:
#     res += n % 10
#     n = int(n / 10)

# print(res)

# 8. Viết chương trình yêu cầu nhập tên và in ra lời chào kèm tên đó
# name = input("Nhập tên: ")
# print("Xin chào", name, "!")

# 9. Kiểm tra xem một năm có phải năm nhuận không
# year = int(input("Nhập năm: "))

# if year % 400 == 0 or (year % 100 != 0 and year % 4 == 0): print("Năm nhuận")
# else: print("Năm không nhuận")

# 10. Nhập vào ba số và tìm số lớn nhất
# a, b, c = map(int, input("Nhập ba số (cách nhau bởi dấu cách): ").split())
# print(a if (a >= b and a >= c) else (b if b >= c else c))

# 11. Kiểm tra số nhập vào có phải là số đối xứng không (VD: 121, 1221)
# n = list(map(int, input("Nhập số nguyên: ")))
# isSymmetric = True
# for i in range(int(len(n) / 2)):
#     if n[i] != n[len(n) - i - 1]: isSymmetric = False

# print("Đối xứng" if isSymmetric else "Không đối xứng")

# 12. Viết chương trình tính lãi suất ngân hàng với công thức đơn giản
# balance = int(input("Nhập vốn: "))
# interest = float(input("Nhập phần trăm lãi: "))
# period = int(input("Nhập số chu kỳ: "))
# print(f"Vốn + lãi sau {period} chu kỳ:", int(balance * ((1 + interest / 100) ** period)))

# 13. Chuyển đổi độ C sang độ F: F = C * 9/5 + 32
# c = int(input("Nhập nhiệt độ C: "))
# print(f"{c} độ C =", c * 9 / 5 + 32, "độ F")

# 14. Viết chương trình giải phương trình bậc nhất ax + b = 0
# print("Giải phương trình ax + b = 0")
# a, b = map(int, input("Nhập a và b (cách nhau bởi dấu cách): ").split())
# print("x =", - b / a)

# 15. Nhập vào ba cạnh của một tam giác, kiểm tra xem có phải tam giác hợp lệ không
# a, b, c = map(int, input("Nhập ba cạnh của tam giác (cách nhau bởi dấu cách): ").split())
# print("Tam giác hợp lệ" if (a + b > c and a + c > b and b + c > a) else "Tam giác không hợp lệ")

# 16. Viết chương trình tính giai thừa của một số nguyên dương
# n = int(input("Nhập số nguyên dương: "))
# if n <= 0: print("Hãy nhập số nguyên dương (lớn hơn 0)")
# elif n == 1 or n == 2: print(f"{n}! = {n}")
# else:
#     res = 2
#     for i in range(3, n + 1): res *= i
#     print(f"{n}! = {res}")

# 17. Nhập vào điểm trung bình, kiểm tra xếp loại (A, B, C, D, F)
# grade = float(input("Nhập điểm trung bình: "))
# if grade > 10 or grade < 0: print("Điểm trung bình không hợp lệ")
# elif grade >= 8.5: print("A")
# elif grade >= 7: print("B")
# elif grade >= 5.5: print("C")
# elif grade >= 4: print("D")
# else: print("F")

# 18. Viết chương trình kiểm tra mật khẩu nhập vào có đúng không (password = "admin123")
# pw = input("Nhập mật khẩu: ")
# password = 'admin123'
# print("Mật khẩu chính xác" if pw == password else "Sai mật khẩu")

# 19. Nhập vào giờ phút giây, tính số giây tương ứng.
# h, m, s = map(int, input("Nhập thời gian (hh:mm:ss): ").split(':'))
# print("Tổng số giây:", h * 3600 + m * 60 + s, "giây")

# 20. Viết chương trình đổi số thành chữ (VD: 123 -> One Two Three)
number = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
n = list(map(int, input("Nhập số nguyên: ")))
for i in n: print(number[i], end=" ")