from pymongo import MongoClient
from datetime import datetime

class Data:
    def __init__(self):
        self.client = MongoClient("mongodb://localhost:27017/")
        self.db = self.client["library_manager"]
        self.collection = self.db["books"]

    def add_book(self, title, author, genre, image_path, price):
        book = {
            "title": title,
            "author": author,
            "genre": genre,
            "image_path": image_path,
            "sales_count": 0,
            "sales_revenue": 0.0,
            "last_sold_date": None,
            "added_date": datetime.now(),
            "price": price
        }
        self.collection.insert_one(book)

    def get_books(self):
        return list(self.collection.find({}))

    def get_books_by_genre(self, genre):
        return list(self.collection.find({"genre": genre}))

    def update_book(self, book_id, new_title, new_author, new_genre, new_image_path, new_price):
        self.collection.update_one({"_id": book_id}, {"$set": {"title": new_title, "author": new_author, "genre": new_genre, "image_path": new_image_path, "price": new_price}})

    def delete_book(self, book_id):
        self.collection.delete_one({"_id": book_id})
        
    def update_sales(self, book_id, sales_count, sales_revenue):
        self.collection.update_one(
            {"_id": book_id},
            {
                "$set": {
                    "sales_count": sales_count,
                    "sales_revenue": sales_revenue,
                    "last_sold_date": datetime.now()
                }
            }
        )