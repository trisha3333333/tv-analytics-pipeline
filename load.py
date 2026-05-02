import boto3
import pandas as pd
import io
import logging
from datetime import datetime
from config import (
    AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION,
    S3_BUCKET, S3_PREFIX
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def get_s3_client():
    """Create and return an S3 client."""
    return boto3.client(
        "s3",
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY
    )


def upload_dataframe_to_s3(df, table_name, s3_client):
    """Upload a DataFrame to S3 as a CSV file partitioned by date."""
    date_partition = datetime.utcnow().strftime("%Y-%m-%d")
    s3_key = f"{S3_PREFIX}/{table_name}/load_date={date_partition}/{table_name}.csv"

    # Convert DataFrame to CSV in memory
    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=False)

    s3_client.put_object(
        Bucket=S3_BUCKET,
        Key=s3_key,
        Body=csv_buffer.getvalue(),
        ContentType="text/csv"
    )

    logger.info(f"  Uploaded {table_name}: s3://{S3_BUCKET}/{s3_key} ({len(df)} rows)")
    return s3_key


def load_all(shows, genres, networks, episodes):
    """Upload all transformed DataFrames to S3."""
    logger.info("Connecting to AWS S3...")
    s3_client = get_s3_client()

    tables = {
        "shows": shows,
        "genres": genres,
        "networks": networks,
        "episodes": episodes
    }

    uploaded_keys = {}
    for table_name, df in tables.items():
        key = upload_dataframe_to_s3(df, table_name, s3_client)
        uploaded_keys[table_name] = key

    logger.info(f"All tables loaded to s3://{S3_BUCKET}/")
    return uploaded_keys


def verify_upload(s3_client):
    """List uploaded files to confirm load succeeded."""
    logger.info(f"Verifying uploads in s3://{S3_BUCKET}/{S3_PREFIX}/...")
    response = s3_client.list_objects_v2(Bucket=S3_BUCKET, Prefix=S3_PREFIX)

    if "Contents" not in response:
        logger.warning("No files found in S3 bucket.")
        return

    for obj in response["Contents"]:
        size_kb = obj["Size"] / 1024
        logger.info(f"  {obj['Key']} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    # Test connection
    client = get_s3_client()
    verify_upload(client)
