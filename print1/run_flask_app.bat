@echo off
cd /d "C:\Users\Akshaj K T\Desktop\print1"
call venv\Scripts\activate
start "" "http://127.0.0.1:5000"
python app.py
