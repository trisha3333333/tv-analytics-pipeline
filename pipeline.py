import logging
from datetime import datetime
from extract import extract_all_data
from transform import transform_all
from load import load_all, get_s3_client, verify_upload

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("pipeline.log")
    ]
)
logger = logging.getLogger(__name__)


def run_pipeline():
    """Run the full ETL pipeline: Extract → Transform → Load."""
    start_time = datetime.utcnow()
    logger.info("=" * 60)
    logger.info("TV ANALYTICS PIPELINE STARTED")
    logger.info(f"Run time: {start_time.strftime('%Y-%m-%d %H:%M:%S UTC')}")
    logger.info("=" * 60)

    try:
        # EXTRACT
        logger.info("STEP 1: EXTRACT")
        shows_raw, genres_raw, networks_raw, episodes_raw = extract_all_data()

        # TRANSFORM
        logger.info("STEP 2: TRANSFORM")
        shows, genres, networks, episodes = transform_all(
            shows_raw, genres_raw, networks_raw, episodes_raw
        )

        # LOAD
        logger.info("STEP 3: LOAD")
        uploaded_keys = load_all(shows, genres, networks, episodes)

        # VERIFY
        s3_client = get_s3_client()
        verify_upload(s3_client)

        end_time = datetime.utcnow()
        duration = (end_time - start_time).seconds
        logger.info("=" * 60)
        logger.info(f"PIPELINE COMPLETE — Duration: {duration}s")
        logger.info(f"Shows loaded: {len(shows)}")
        logger.info(f"Genre records: {len(genres)}")
        logger.info(f"Network records: {len(networks)}")
        logger.info(f"Episode/season records: {len(episodes)}")
        logger.info("=" * 60)

        return True

    except Exception as e:
        logger.error(f"PIPELINE FAILED: {e}", exc_info=True)
        return False


if __name__ == "__main__":
    success = run_pipeline()
    exit(0 if success else 1)
