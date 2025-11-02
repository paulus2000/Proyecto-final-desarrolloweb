import os
import smtplib
import sys

host = os.environ.get('EMAIL_HOST')
port = int(os.environ.get('EMAIL_PORT', '587'))
user = os.environ.get('EMAIL_HOST_USER')
pwd = os.environ.get('EMAIL_HOST_PASSWORD')
use_tls = os.environ.get('EMAIL_USE_TLS', 'True').lower() in ('1','true','yes')
from_addr = os.environ.get('DEFAULT_FROM_EMAIL', user)
to_addr = os.environ.get('TEST_EMAIL_RECIPIENT', user)

print('SMTP test script starting...')
print('Using:', host, 'port', port, 'user', user, 'use_tls', use_tls)
if not host or not user or not pwd:
    print('ERROR: Missing one of EMAIL_HOST, EMAIL_HOST_USER or EMAIL_HOST_PASSWORD in environment')
    sys.exit(2)

try:
    if use_tls:
        srv = smtplib.SMTP(host, port, timeout=20)
        srv.ehlo()
        srv.starttls()
        srv.ehlo()
    else:
        srv = smtplib.SMTP_SSL(host, port, timeout=20)
    print('Connected to SMTP server, attempting login...')
    srv.login(user, pwd)
    print('Login successful')
    subject = 'Prueba de correo desde Proyecto-final-desarrolloweb'
    body = 'Este es un correo de prueba enviado desde el script test_smtp.py'
    msg = f"Subject: {subject}\nFrom: {from_addr}\nTo: {to_addr}\n\n{body}"
    srv.sendmail(from_addr, [to_addr], msg)
    print('Email sent to', to_addr)
    srv.quit()
    sys.exit(0)
except Exception as e:
    print('SMTP error:', repr(e))
    sys.exit(1)
