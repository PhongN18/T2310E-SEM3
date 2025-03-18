from pymongo import MongoClient

class Database:
    def __init__(self):
        self.client = MongoClient("mongodb://localhost:27017/")
        self.db = self.client["library_manager"]
        self.collection = self.db["books"]

    def add_book(self, title, author, genre):
        book = {"title": title, "author": author, "genre": genre}
        self.collection.insert_one(book)

    def get_books(self):
        return list(self.collection.find({}, {"_id": 1, "title": 1, "author": 1, "genre": 1}))

    def update_book(self, book_id, new_title, new_author, new_genre):
        self.collection.update_one({"_id": book_id}, {"$set": {"title": new_title, "author": new_author, "genre": new_genre}})

    def delete_book(self, book_id):
        self.collection.delete_one({"_id": book_id})
