from models.data import Data
from views.welcome_screen import WelcomeScreen
from views.manage_window import ManageWindow
from views.add_book_window import AddBookWindow
from views.update_book_window import UpdateBookWindow
from views.view_books_window import ViewBooksWindow
from views.analysis_window import AnalysisWindow
from bson.objectid import ObjectId

class AppController:
    def __init__(self, root):
        self.root = root
        self.root.title("Library Manager")
        self.root.geometry("1000x600")
        self.root.configure(bg="#fff3e0")

        self.db = Data()
        
        self.welcome_screen = WelcomeScreen(root, self)
        self.manage_window = None
        self.view_genres_window = None
        self.view_books_window = None

        self.show_welcome()

    def show_frame(self, frame):
        """Hiển thị màn hình được chọn, ẩn tất cả màn hình khác."""
        for widget in self.root.winfo_children():
            widget.pack_forget()
        frame.pack(fill="both", expand=True)

    def show_welcome(self):
        """Hiển thị màn hình chào mừng."""
        self.show_frame(self.welcome_screen.frame)

    def show_manage_library(self):
        """Hiển thị màn hình quản lý thư viện (CRUD)."""
        if self.manage_window is None:
            self.manage_window = ManageWindow(self.root, self)
        self.load_books()
        self.show_frame(self.manage_window.frame)

    def load_books(self):
        """Tải danh sách sách từ MongoDB và cập nhật vào GUI."""
        books = self.db.get_books()
        if self.manage_window:
            self.manage_window.update_book_list(books)

    def show_add_book(self):
        """Mở cửa sổ thêm sách mới."""
        AddBookWindow(self.root, self)

    def add_book(self, title, author, genre, image_path, price):
        """Thêm sách mới vào MongoDB và làm mới danh sách."""
        self.db.add_book(title, author, genre, image_path, price)
        self.load_books()

    def show_update_book(self, book_id):
        """Mở cửa sổ cập nhật sách đã chọn."""
        if self.manage_window:
            if book_id:
                book = self.db.collection.find_one({"_id": ObjectId(book_id)})
                UpdateBookWindow(self.root, self, book)
            else:
                print("Error")

    def update_book(self, book_id, title, author, genre, image_path, price):
        """Cập nhật sách trong MongoDB và làm mới danh sách."""
        self.db.update_book(ObjectId(book_id), title, author, genre, image_path, price)
        self.load_books()

    def delete_book(self):
        """Xóa sách đã chọn khỏi MongoDB."""
        if self.manage_window:
            book_id = self.manage_window.get_selected_book_id()
            if book_id:
                self.db.delete_book(ObjectId(book_id))
                self.load_books()

    def show_view_books(self):
        """Hiển thị danh sách sách thuộc thể loại được chọn."""
        if self.view_books_window:
            self.view_books_window.frame.pack_forget()  # Ẩn màn hình cũ
        self.view_books_window = ViewBooksWindow(self.root, self)
        self.show_frame(self.view_books_window.frame)

    def get_books_by_genre(self, genre):
        """Truy vấn danh sách sách theo thể loại."""
        return self.db.get_books_by_genre(genre)
    
    def show_analysis(self):
        """Hiển thị cửa sổ phân tích dữ liệu."""
        AnalysisWindow(self.root)
