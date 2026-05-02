import boto3
import time
import json
import os

ATHENA_DATABASE = "tv_analytics"
ATHENA_OUTPUT = "s3://tv-analytics-pipeline/athena-results/"
REGION = os.environ.get("AWS_REGION", "us-east-2")

athena = boto3.client("athena", region_name=REGION)


def run_query(sql):
    response = athena.start_query_execution(
        QueryString=sql,
        QueryExecutionContext={"Database": ATHENA_DATABASE},
        ResultConfiguration={"OutputLocation": ATHENA_OUTPUT},
    )
    query_id = response["QueryExecutionId"]

    # Wait for completion
    for _ in range(30):
        status = athena.get_query_execution(QueryExecutionId=query_id)
        state = status["QueryExecution"]["Status"]["State"]
        if state == "SUCCEEDED":
            break
        elif state in ["FAILED", "CANCELLED"]:
            raise Exception(f"Query failed: {state}")
        time.sleep(1)

    # Get results
    results = athena.get_query_results(QueryExecutionId=query_id)
    rows = results["ResultSet"]["Rows"]
    headers = [col["VarCharValue"] for col in rows[0]["Data"]]
    data = []
    for row in rows[1:]:
        values = [col.get("VarCharValue", "") for col in row["Data"]]
        data.append(dict(zip(headers, values)))
    return data


QUERIES = {
    "top_shows": """
        SELECT name, vote_average, vote_count, year_started, status
        FROM tv_analytics.shows
        WHERE vote_count >= 100
        ORDER BY vote_average DESC
        LIMIT 20
    """,
    "genre_ratings": """
        SELECT g.genre_name,
               ROUND(AVG(CAST(s.vote_average AS DOUBLE)), 2) AS avg_rating,
               COUNT(DISTINCT s.show_id) AS show_count
        FROM tv_analytics.shows s
        JOIN tv_analytics.genres g ON s.show_id = g.show_id
        WHERE CAST(s.vote_count AS INT) >= 50
        GROUP BY g.genre_name
        ORDER BY avg_rating DESC
        LIMIT 15
    """,
    "top_networks": """
        SELECT n.network_name,
               COUNT(DISTINCT n.show_id) AS show_count,
               ROUND(AVG(CAST(s.vote_average AS DOUBLE)), 2) AS avg_rating
        FROM tv_analytics.networks n
        JOIN tv_analytics.shows s ON n.show_id = s.show_id
        GROUP BY n.network_name
        ORDER BY show_count DESC
        LIMIT 15
    """,
    "trends_by_year": """
        SELECT year_started,
               COUNT(*) AS shows_released,
               ROUND(AVG(CAST(vote_average AS DOUBLE)), 2) AS avg_rating
        FROM tv_analytics.shows
        WHERE year_started >= 2000
        AND year_started IS NOT NULL
        AND year_started != ''
        GROUP BY year_started
        ORDER BY year_started ASC
    """,
    "status_breakdown": """
        SELECT status,
               COUNT(*) AS count
        FROM tv_analytics.shows
        GROUP BY status
        ORDER BY count DESC
    """
}


def lambda_handler(event, context):
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET,OPTIONS"
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    query_name = event.get("queryStringParameters", {}) or {}
    query_name = query_name.get("query", "top_shows")

    if query_name not in QUERIES:
        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({"error": f"Unknown query: {query_name}"})
        }

    try:
        data = run_query(QUERIES[query_name])
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps(data)
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"error": str(e)})
        }
