from datetime import datetime
from database import db

class User:
    def __init__(self, name, email, password_hash, role):
        self.name = name
        self.email = email
        self.password_hash = password_hash
        self.role = role
        self.created_at = datetime.utcnow()

    def save(self):
        user_data = {
            "name": self.name,
            "email": self.email,
            "password_hash": self.password_hash,
            "role": self.role,
            "created_at": self.created_at
        }
        db.db.users.insert_one(user_data)
