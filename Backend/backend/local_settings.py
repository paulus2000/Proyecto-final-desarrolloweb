"""
Local settings for development.

This file is optional and is imported by `backend/settings.py` if present.
It configures Django to use a local SQLite database so you can run the project
without MariaDB/XAMPP while developing.

If you prefer MariaDB, remove this file or keep it out of version control.
"""
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

import os

# Convenience: default to console email backend for local testing. If you
# want to send real emails, set EMAIL_HOST and related env vars (see README
# below) and the SMTP backend will be used instead.
EMAIL_BACKEND = os.environ.get('EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend')

# For local development we relax Django's password validators so simple test
# passwords (like "12345678") are accepted. Remove or tighten this in
# production.
AUTH_PASSWORD_VALIDATORS = []

# Optional: configure frontend base url used in notification emails
FRONTEND_BASE_URL = os.environ.get('FRONTEND_BASE_URL', 'http://localhost:5173')

# Default from email for outgoing messages in development. Prefer setting
# DEFAULT_FROM_EMAIL via env var in production.
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', 'no-reply@localhost')

# If EMAIL_HOST is provided in the environment, configure SMTP settings
# to use a real SMTP server. Do NOT store passwords in source control;
# set them as environment variables instead.
if os.environ.get('EMAIL_HOST'):
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = os.environ.get('EMAIL_HOST')
    EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
    EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
    EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
    EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', 'True').lower() in ('1', 'true', 'yes')
