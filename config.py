import os
from dotenv import load_dotenv

load_dotenv()

# TMDB
TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_ACCESS_TOKEN = os.getenv("TMDB_ACCESS_TOKEN")
TMDB_BASE_URL = "https://api.themoviedb.org/3"

# AWS
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-2")

# S3
S3_BUCKET = os.getenv("S3_BUCKET", "tv-analytics-pipeline")
S3_PREFIX = os.getenv("S3_PREFIX", "data")

# Athena
ATHENA_DATABASE = os.getenv("ATHENA_DATABASE", "tv_analytics")
ATHENA_OUTPUT_BUCKET = os.getenv("ATHENA_OUTPUT_BUCKET")

# How many pages of shows to pull (20 shows per page)
PAGES_TO_FETCH = 50  # pulls ~1000 shows
