import pandas as pd
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def transform_shows(df):
    """Clean and transform the shows DataFrame."""
    logger.info("Transforming shows data...")

    # Drop duplicates
    df = df.drop_duplicates(subset="show_id")

    # Parse dates
    for col in ["first_air_date", "last_air_date"]:
        df[col] = pd.to_datetime(df[col], errors="coerce")

    # Fill nulls
    df["vote_average"] = df["vote_average"].fillna(0.0).round(2)
    df["vote_count"] = df["vote_count"].fillna(0).astype(int)
    df["popularity"] = df["popularity"].fillna(0.0).round(3)
    df["number_of_seasons"] = df["number_of_seasons"].fillna(0).astype(int)
    df["number_of_episodes"] = df["number_of_episodes"].fillna(0).astype(int)
    df["status"] = df["status"].fillna("Unknown")
    df["content_rating"] = df["content_rating"].fillna("NR")

    # Add derived columns
    df["year_started"] = df["first_air_date"].dt.year
    df["is_ongoing"] = df["status"].isin(["Returning Series", "In Production"])
    df["pipeline_load_date"] = datetime.utcnow().strftime("%Y-%m-%d")

    # Filter out bad rows
    df = df[df["name"].notna()]
    df = df[df["vote_count"] >= 10]  # remove shows with almost no ratings

    logger.info(f"Shows after transform: {len(df)}")
    return df


def transform_genres(df):
    """Clean genres data."""
    logger.info("Transforming genres data...")
    df = df.drop_duplicates()
    df = df[df["genre_name"].notna()]
    logger.info(f"Genre records: {len(df)}")
    return df


def transform_networks(df):
    """Clean networks data."""
    logger.info("Transforming networks data...")
    df = df.drop_duplicates()
    df = df[df["network_name"].notna()]
    logger.info(f"Network records: {len(df)}")
    return df


def transform_episodes(df):
    """Clean episodes/seasons data."""
    logger.info("Transforming episodes data...")
    df = df.drop_duplicates()
    df["air_date"] = pd.to_datetime(df["air_date"], errors="coerce")
    df["episode_count"] = df["episode_count"].fillna(0).astype(int)
    df["vote_average"] = df["vote_average"].fillna(0.0).round(2)

    # Remove specials season (season 0)
    df = df[df["season_number"] > 0]

    logger.info(f"Episode/season records: {len(df)}")
    return df


def transform_all(shows_raw, genres_raw, networks_raw, episodes_raw):
    """Run all transformations and return cleaned DataFrames."""
    shows = transform_shows(shows_raw)
    genres = transform_genres(genres_raw)
    networks = transform_networks(networks_raw)
    episodes = transform_episodes(episodes_raw)

    # Only keep genres/networks/episodes for shows that passed filtering
    valid_ids = set(shows["show_id"].tolist())
    genres = genres[genres["show_id"].isin(valid_ids)]
    networks = networks[networks["show_id"].isin(valid_ids)]
    episodes = episodes[episodes["show_id"].isin(valid_ids)]

    logger.info("All transformations complete.")
    return shows, genres, networks, episodes


if __name__ == "__main__":
    # Quick test with dummy data
    sample = pd.DataFrame([{
        "show_id": 1, "name": "Test Show", "original_language": "en",
        "status": "Returning Series", "type": "Scripted",
        "first_air_date": "2020-01-01", "last_air_date": "2023-06-01",
        "number_of_seasons": 3, "number_of_episodes": 30,
        "vote_average": 8.2, "vote_count": 500, "popularity": 120.5,
        "content_rating": "TV-MA", "overview": "A test show."
    }])
    result = transform_shows(sample)
    print(result.to_string())
