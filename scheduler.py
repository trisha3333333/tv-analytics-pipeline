import schedule
import time
import logging
from pipeline import run_pipeline

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def scheduled_run():
    logger.info("Scheduled pipeline run starting...")
    success = run_pipeline()
    if success:
        logger.info("Scheduled run completed successfully.")
    else:
        logger.error("Scheduled run failed — check pipeline.log for details.")


# Run pipeline every day at 6:00 AM
schedule.every().day.at("06:00").do(scheduled_run)

# Uncomment below to also run every Sunday for a weekly full refresh
# schedule.every().sunday.at("08:00").do(scheduled_run)

if __name__ == "__main__":
    logger.info("Scheduler started. Pipeline will run daily at 06:00 AM.")
    logger.info("Press Ctrl+C to stop.")

    # Run once immediately on start
    scheduled_run()

    while True:
        schedule.run_pending()
        time.sleep(60)
