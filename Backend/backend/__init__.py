
# If using PyMySQL as the DB driver for MySQL/MariaDB, install it as MySQLdb
try:
	import pymysql
	pymysql.install_as_MySQLdb()
except Exception:
	# If PyMySQL is not installed yet, this will be a no-op until dependencies are installed
	pass
