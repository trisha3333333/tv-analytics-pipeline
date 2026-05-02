# TV Show Ratings Analytics Pipeline

An end-to-end data engineering project that extracts TV show data from the TMDB API, transforms and loads it into an AWS S3 data lake, queries it with AWS Athena, and visualizes insights in a live React dashboard deployed on AWS Amplify.

## 🚀 Live Dashboard
**[https://main.d1j80mhkaqzs3m.amplifyapp.com/](https://main.d1j80mhkaqzs3m.amplifyapp.com/)**

## Architecture

```
TMDB API → Python ETL Pipeline → AWS S3 (Data Lake) → AWS Athena → AWS Lambda → API Gateway → React Dashboard → AWS Amplify
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Extraction | Python, TMDB REST API |
| Transformation | Python, Pandas |
| Storage | AWS S3 (data lake) |
| Querying | AWS Athena (serverless SQL) |
| Backend API | AWS Lambda + API Gateway |
| Visualization | React, Recharts |
| Hosting | AWS Amplify |
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


## Dashboard
The React dashboard is live at **[https://main.d1j80mhkaqzs3m.amplifyapp.com/](https://main.d1j80mhkaqzs3m.amplifyapp.com/)** and is powered by AWS Lambda + API Gateway querying Athena in real time.

