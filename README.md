# TV Show Ratings Analytics Pipeline

An end-to-end data engineering project that extracts TV show data from the TMDB API, transforms and loads it into an AWS S3 data lake, queries it with AWS Athena, and visualizes insights in a AWS QuickSight dashboard.

## Architecture

```
TMDB API → Python ETL Pipeline → AWS S3 (Data Lake) → AWS Athena → AWS QuickSight Dashboard
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Extraction | Python, TMDB REST API |
| Transformation | Python, Pandas |
| Storage | AWS S3 (data lake) |
| Querying | AWS Athena (serverless SQL) |
| Cataloging | AWS Glue (schema management) |
| Visualization | AWS QuickSight |
| Scheduling | Python `schedule` library |

## Data Schema

### shows
| Column | Type | Description |
|--------|------|-------------|
| show_id | INT | Primary key |
| name | STRING | Show title |
| status | STRING | Returning Series, Ended, etc. |
| first_air_date | DATE | Premiere date |
| vote_average | DOUBLE | TMDB rating (0–10) |
| vote_count | INT | Number of ratings |
| popularity | DOUBLE | TMDB popularity score |
| content_rating | STRING | TV-MA, TV-14, etc. |
| year_started | INT | Derived from first_air_date |
| is_ongoing | BOOLEAN | True if still airing |

### genres
| Column | Type | Description |
|--------|------|-------------|
| show_id | INT | Foreign key → shows |
| genre_id | INT | TMDB genre ID |
| genre_name | STRING | Drama, Comedy, etc. |

### networks
| Column | Type | Description |
|--------|------|-------------|
| show_id | INT | Foreign key → shows |
| network_id | INT | TMDB network ID |
| network_name | STRING | HBO, Netflix, etc. |
| origin_country | STRING | Country code |

### episodes
| Column | Type | Description |
|--------|------|-------------|
| show_id | INT | Foreign key → shows |
| season_number | INT | Season number |
| episode_count | INT | Episodes in season |
| air_date | DATE | Season premiere date |
| vote_average | DOUBLE | Season rating |

## Setup & Installation

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/tv-analytics-pipeline.git
cd tv-analytics-pipeline
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` and fill in your:
- TMDB API key (get one free at themoviedb.org)
- AWS credentials (Access Key ID + Secret)
- S3 bucket name

### 4. Set up Athena tables
- Open AWS Athena console
- Run each query in `athena_queries/setup.sql` in order

### 5. Run the pipeline
```bash
python pipeline.py
```

### 6. Run on a schedule (daily refresh)
```bash
python scheduler.py
```

## Dashboard
See `dashboard/README.md` for AWS QuickSight connection and setup instructions.

## Project Structure
```
tv-analytics-pipeline/
├── pipeline.py           # Main ETL runner
├── extract.py            # TMDB API extraction
├── transform.py          # Data cleaning & transformation
├── load.py               # AWS S3 upload
├── scheduler.py          # Automated daily refresh
├── config.py             # Environment config
├── requirements.txt      
├── .env.example          # Credentials template
├── .gitignore            
├── athena_queries/
│   └── setup.sql         # Athena table creation + analysis queries
└── dashboard/
    └── README.md         # AWS QuickSight connection guide
```
