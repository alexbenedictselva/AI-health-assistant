#auth.py

from datetime import datetime, timedelta
from jose import jwt
import hashlib
import secrets

SECRET_KEY = "supersecretkey"   # move to .env later
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def hash_password(password: str):
    # Use SHA-256 with salt for password hashing
    salt = secrets.token_hex(16)
    password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"{salt}:{password_hash}"

def verify_password(plain: str, hashed: str):
    try:
        salt, password_hash = hashed.split(':')
        return hashlib.sha256((plain + salt).encode()).hexdigest() == password_hash
    except:
        return False

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)