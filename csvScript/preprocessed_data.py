import pandas as pd
from sqlalchemy import create_engine
import pymysql
import csv

db_config = {
    'host': 'internship-db.mysql.database.azure.com',
    'user': 'internshipUser',
    'password': 'linaROOT20!',
    'database': 'alerts',
    'port': 3306,
    'ssl_ca': 'DigiCertGlobalRootCA.crt.pem'
}


def test_db_connection():
    try:
        engine = create_engine(
            f"mysql+pymysql://{db_config['user']}:{db_config['password']}@"
            f"{db_config['host']}:{db_config['port']}/{db_config['database']}?ssl_ca={db_config['ssl_ca']}"
        )
        connection = engine.connect()
        print("Connection to the database was successful.")
        connection.close()
    except Exception as e:
        print(f"Error connecting to the database: {e}")


def fetch_and_filter_data_from_db():
    try:

        engine = create_engine(
            f"mysql+pymysql://{db_config['user']}:{db_config['password']}@"
            f"{db_config['host']}:{db_config['port']}/{db_config['database']}?ssl_ca={db_config['ssl_ca']}"
        )
        
        query = "SELECT * FROM resource_created"
        df = pd.read_sql(query, engine)

        filtered_df = df[df['caller'].str.contains("@")]

        filtered_df.to_csv('filtered_activity_logs.csv', index=False, quotechar='"', quoting=csv.QUOTE_ALL)
        print("Data fetched from the database and saved to filtered_activity_logs.csv")
    except Exception as e:
        print(f"Error fetching data from the database: {e}")



test_db_connection()

fetch_and_filter_data_from_db()