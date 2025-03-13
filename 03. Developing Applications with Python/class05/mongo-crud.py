from pymongo import MongoClient
from pprint import pprint
import sys

class MongoCRUD:
    def __init__(self):
        # Connect to MongoDB
        self.client = MongoClient('mongodb://localhost:27017/')
        self.db = self.client['mydatabase']
        self.collection = self.db['users']
        
    def create(self):
        print("\n=== Add new user ===")
        name = input("Name: ")
        age = int(input("Age: "))
        email = input("Email: ")
        
        user = {
            "name": name,
            "age": age,
            "email": email
        }
        
        result = self.collection.insert_one(user)
        print(f"Added new user with ID: {result.inserted_id}")
        
    def read(self):
        print("\n=== Users list ===")
        users = self.collection.find()
        for user in users:
            pprint(user)
            
    def update(self):
        print("\n=== Update user ===")
        email = input("Email of updating user: ")
        print("Input new infomation (blank if unchange)")
        new_name = input("Name: ")
        new_age = input("Age: ")
        
        update_data = {}
        if new_name: update_data["name"] = new_name
        if new_age: update_data["age"] = int(new_age)
        
        if update_data:
            result = self.collection.update_one(
                { "email": email },
                { "$set": update_data }
            )
            if result.modified_count > 0:
                print("Update successfully!")
            else:
                print("No user found or no changes made.")
                
    def delete(self):
        print("\n=== Delete user ===")
        email = input("Email of deleting user: ")
        result = self.collection.delete_one({ "email": email })
        if result.deleted_count > 0:
            print("Delete user successfully!")
        else:
            print("No user found.")
    
    def menu(self):
        while True:
            print("\n=== User Management ===")
            print("1. Add new user")
            print("2. View users list")
            print("3. Update user")
            print("4. Delete user")
            print("5. Exit")
            choice = input("Select feature (1-5): ")
            
            match choice:
                case "1":
                    self.create()
                case "2":
                    self.read()
                case "3":
                    self.update()
                case "4":
                    self.delete()
                case "5":
                    print("Goodbye!")
                    self.client.close()
                    sys.exit(0)
                    break
                case _:
                    print("Invalid choice")

def main():
    try:
        crud = MongoCRUD()
        crud.menu()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()