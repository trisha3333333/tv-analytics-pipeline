import requests
import pandas as pd
import time
import logging
from config import TMDB_ACCESS_TOKEN, TMDB_BASE_URL, PAGES_TO_FETCH

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

HEADERS = {
    "accept": "application/json",
    "Authorization": f"Bearer {TMDB_ACCESS_TOKEN}"
}


def fetch_popular_shows(pages=PAGES_TO_FETCH):
    """Fetch popular TV shows from TMDB API."""
    shows = []
    logger.info(f"Fetching {pages} pages of popular TV shows...")

    for page in range(1, pages + 1):
        url = f"{TMDB_BASE_URL}/tv/popular"
        params = {"language": "en-US", "page": page}
        response = requests.get(url, headers=HEADERS, params=params)

        if response.status_code == 200:
            results = response.json().get("results", [])
            shows.extend(results)
            if page % 10 == 0:
                logger.info(f"  Fetched page {page}/{pages} — {len(shows)} shows so far")
        else:
            logger.warning(f"  Failed page {page}: {response.status_code}")

        time.sleep(0.25)  # respect rate limits

    logger.info(f"Total shows fetched: {len(shows)}")
    return shows


def fetch_show_details(show_id):
    """Fetch detailed info for a single show including genres and episodes."""
    url = f"{TMDB_BASE_URL}/tv/{show_id}"
    params = {"language": "en-US"}
    response = requests.get(url, headers=HEADERS, params=params)

    if response.status_code == 200:
        return response.json()
    return None


def fetch_show_ratings(show_id):
    """Fetch content ratings for a show."""
    url = f"{TMDB_BASE_URL}/tv/{show_id}/content_ratings"
    response = requests.get(url, headers=HEADERS)

    if response.status_code == 200:
        results = response.json().get("results", [])
        us_rating = next((r["rating"] for r in results if r["iso_3166_1"] == "US"), "NR")
        return us_rating
    return "NR"


def extract_all_data():
    """Main extraction function — returns raw shows, genres, networks, episodes."""
    raw_shows = fetch_popular_shows()

    shows_data = []
    genres_data = []
    networks_data = []
    episodes_data = []

    logger.info("Fetching detailed info for each show...")
    for i, show in enumerate(raw_shows):
        show_id = show["id"]
        details = fetch_show_details(show_id)
        rating = fetch_show_ratings(show_id)

        if not details:
            continue

        # Shows table
        shows_data.append({
            "show_id": show_id,
            "name": details.get("name"),
            "original_language": details.get("original_language"),
            "status": details.get("status"),
            "type": details.get("type"),
            "first_air_date": details.get("first_air_date"),
            "last_air_date": details.get("last_air_date"),
            "number_of_seasons": details.get("number_of_seasons"),
            "number_of_episodes": details.get("number_of_episodes"),
            "vote_average": details.get("vote_average"),
            "vote_count": details.get("vote_count"),
            "popularity": details.get("popularity"),
            "content_rating": rating,
            "overview": details.get("overview", "")[:500],
        })

        # Genres table
        for genre in details.get("genres", []):
            genres_data.append({
                "show_id": show_id,
                "genre_id": genre["id"],
                "genre_name": genre["name"]
            })

        # Networks table
        for network in details.get("networks", []):
            networks_data.append({
                "show_id": show_id,
                "network_id": network["id"],
                "network_name": network["name"],
                "origin_country": network.get("origin_country", "")
            })

        # Episodes (season-level summary only to avoid thousands of API calls)
        for season in details.get("seasons", []):
            episodes_data.append({
                "show_id": show_id,
                "season_number": season.get("season_number"),
                "episode_count": season.get("episode_count"),
                "air_date": season.get("air_date"),
                "vote_average": season.get("vote_average", 0.0),
            })

        if (i + 1) % 50 == 0:
            logger.info(f"  Processed {i + 1}/{len(raw_shows)} shows")

        time.sleep(0.1)

    logger.info("Extraction complete.")
    return (
        pd.DataFrame(shows_data),
        pd.DataFrame(genres_data),
        pd.DataFrame(networks_data),
        pd.DataFrame(episodes_data)
    )


if __name__ == "__main__":
    shows, genres, networks, episodes = extract_all_data()
    logger.info(f"Shows: {len(shows)} | Genres: {len(genres)} | Networks: {len(networks)} | Episodes: {len(episodes)}")
