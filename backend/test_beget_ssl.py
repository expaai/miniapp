import psycopg2

conn = psycopg2.connect("""
    host=raputitechit.beget.app
    port=5432
    sslmode=verify-full
    dbname=default_db
    user=cloud_user
    password=v!y0sUEs*uQ4suuhl&&jj?
    target_session_attrs=read-write
""")

q = conn.cursor()
q.execute('SELECT version()')

print(q.fetchone())

conn.close()