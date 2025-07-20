# db_config.py
import os
import psycopg2
import urllib.parse as up

def get_connection():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise Exception("DATABASE_URL not set in environment variables")

    up.uses_netloc.append("postgres")
    url = up.urlparse(db_url)

    return psycopg2.connect(
        database=url.path[1:],
        user=url.username,
        password=url.password,
        host=url.hostname,
        port=url.port
    )
