# Connecting Power BI to AWS Athena

## Prerequisites
- Power BI Desktop installed (free from Microsoft)
- Pipeline has been run at least once (`python pipeline.py`)
- Athena tables created (`athena_queries/setup.sql` run in AWS console)

## Step 1 — Install the Athena ODBC Driver
1. Go to: https://docs.aws.amazon.com/athena/latest/ug/connect-with-odbc.html
2. Download and install the **Simba Athena ODBC Driver** for Mac/Windows

## Step 2 — Configure ODBC Connection
Use these settings:
- **AwsRegion:** us-east-2
- **S3OutputLocation:** s3://tv-analytics-pipeline/athena-results/
- **AuthenticationType:** IAM Credentials
- **UID:** your AWS Access Key ID
- **PWD:** your AWS Secret Access Key

## Step 3 — Connect in Power BI Desktop
1. Open Power BI Desktop
2. Click **Get Data** → **ODBC**
3. Select your Athena DSN
4. Select database: `tv_analytics`
5. Import these tables:
   - `shows`
   - `genres`
   - `networks`
   - `episodes`

## Step 4 — Recommended Dashboard Pages

### Page 1: Overview
- Card: Total shows in dataset
- Card: Average rating across all shows
- Bar chart: Top 10 highest rated shows
- Donut chart: Shows by status (ongoing vs ended)

### Page 2: Genre Analysis
- Bar chart: Average rating by genre
- Treemap: Show count by genre
- Line chart: Genre popularity over years

### Page 3: Network Analysis
- Bar chart: Top 15 networks by show count
- Scatter plot: Network show count vs avg rating
- Table: Network name, show count, avg rating

### Page 4: Trends Over Time
- Line chart: Average rating by year (2000–present)
- Bar chart: Number of new shows released per year
- Area chart: Average seasons per show over time

## Step 5 — Refresh Settings
- In Power BI: File → Options → Data Load
- Set scheduled refresh to match your `scheduler.py` run time (06:00 AM daily)
