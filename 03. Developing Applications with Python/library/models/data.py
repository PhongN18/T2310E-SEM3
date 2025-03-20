from pymongo import MongoClient

class Data:
    def __init__(self):
        self.client = MongoClient("mongodb://localhost:27017/")
        self.db = self.client["library_manager"]
        self.collection = self.db["books"]

    def add_book(self, title, author, genre, image_path):
        book = {"title": title, "author": author, "genre": genre, "image_path": image_path}
        self.collection.insert_one(book)

    def get_books(self):
        return list(self.collection.find({}))

    def get_books_by_genre(self, genre):
        return list(self.collection.find({"genre": genre}))

    def update_book(self, book_id, new_title, new_author, new_genre, new_image_path):
        self.collection.update_one({"_id": book_id}, {"$set": {"title": new_title, "author": new_author, "genre": new_genre, "image_path": new_image_path}})

    def delete_book(self, book_id):
        self.collection.delete_one({"_id": book_id})