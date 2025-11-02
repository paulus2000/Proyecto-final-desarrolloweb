Back-end (Django) setup

Overview
This folder contains a starter Django project configured to use MariaDB/MySQL via PyMySQL. It includes an `events` app with models and basic API endpoints.

Prerequisites
- Python 3.10+ installed
- XAMPP (or MariaDB) installed and running (for local MariaDB)
- Git (optional)

Quickstart (Windows PowerShell)

1) Start MariaDB (XAMPP Control Panel)

2) Create database and user (local dev: password set to 1234)

You can create the database and user either with phpMyAdmin (recommended for comfort) or with the MySQL client shipped with XAMPP.

Option A — phpMyAdmin (GUI):
- Start MySQL in the XAMPP Control Panel.
- Open http://localhost/phpmyadmin
- Use the SQL tab and either paste the SQL below or import `Backend/create_db.sql` from the repo.

Option B — MySQL client (command-line):

```powershell
# run this from PowerShell
c:\xampp\mysql\bin\mysql.exe -u root -p
# (enter root password if any; on default XAMPP installs root has no password)

CREATE DATABASE events_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'events_user'@'localhost' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON events_db.* TO 'events_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Tip: I added `Backend/create_db.sql` with these exact commands so you can import it directly in phpMyAdmin (Import -> choose file -> Go).

3) Create and activate virtualenv (inside Backend)

If PowerShell blocks `Activate.ps1` due to ExecutionPolicy, you have two safe alternatives:

- Use the venv's python executable directly (no activation required):

```powershell
cd 'c:\Users\j_sam\Documents\GitHub\Proyecto-final-desarrolloweb\Backend'
python -m venv venv
.\venv\Scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

- Or activate in cmd.exe (no policy change needed):

```cmd
cd "c:\Users\j_sam\Documents\GitHub\Proyecto-final-desarrolloweb\Backend"
venv\Scripts\activate.bat
pip install -r requirements.txt
```

If you prefer to enable PowerShell activation instead, run PowerShell as Administrator and:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# then in the same user session: .\venv\Scripts\Activate.ps1
```
Only do that if you're comfortable changing the policy.

4) Update DB credentials in `backend/settings.py`

I already updated `backend/settings.py` to use:

- NAME: `events_db`
- USER: `events_user`
- PASSWORD: `1234`
- HOST: `127.0.0.1`
- PORT: `3306`

5) Run migrations and create superuser

Option 1 — Quick start with SQLite (recommended for local development)

If you want to avoid MariaDB/XAMPP complications while developing locally, there's a ready-made SQLite option. The repo contains `backend/local_settings.py` which will be automatically imported if present and will switch Django to use a local `db.sqlite3` file.

Run the following (using the venv python executable avoids PowerShell activation issues):

```powershell
cd 'c:\Users\j_sam\Documents\GitHub\Proyecto-final-desarrolloweb\Backend'
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe manage.py makemigrations
.\venv\Scripts\python.exe manage.py migrate
.\venv\Scripts\python.exe manage.py createsuperuser
.\venv\Scripts\python.exe manage.py runserver
```

Option 2 — Use MariaDB (XAMPP) as previously described

If you prefer MariaDB, make sure MySQL is started in XAMPP and that `backend/settings.py` contains the correct credentials (the repo currently has a development password of `1234`). Then run the same commands above to apply migrations and create a superuser.

If migrations fail with a connection error, confirm MySQL is started in XAMPP and that the credentials in `backend/settings.py` match the mysql user created earlier.

API endpoints
- GET /api/events/  -> list events
- GET /api/events/{id}/ -> event detail
- POST /api/events/{id}/register/ -> register current authenticated user
- POST /api/events/{id}/cancel/ -> cancel registration

Notes
- The project uses PyMySQL by default to avoid Windows build issues with mysqlclient. If you prefer `mysqlclient`, install it and remove PyMySQL shim in `backend/__init__.py`.
- For sending reminder emails when events start, you can add Celery + Redis or a periodic management command (django-crontab) that sends emails to registrations.
