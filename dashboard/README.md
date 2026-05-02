# Connecting AWS QuickSight to Athena

## Prerequisites
- Pipeline has been run at least once (`python pipeline.py`)
- Athena tables created (`athena_queries/setup.sql` run in AWS console)
- AWS account with QuickSight access

## Step 1 — Sign Up for QuickSight
1. Go to AWS Console → search **QuickSight**
2. Click **Sign up for QuickSight**
3. Choose **Standard Edition** (free trial, then $9/month — cancel after project)
4. Select your region: **us-east-2**
5. Give it access to **Athena** and **S3** when prompted

## Step 2 — Connect QuickSight to Athena
1. In QuickSight click **Datasets** → **New dataset**
2. Select **Athena** as the data source
3. Name it `tv-analytics`
4. Select workgroup: **primary**
5. Click **Validate connection** → should show green
6. Click **Create data source**

## Step 3 — Import Your Tables
For each table (shows, genres, networks, episodes):
1. Select database: `tv_analytics`
2. Select the table
3. Choose **Import to SPICE** for faster queries
4. Click **Visualize**

## Step 4 — Recommended Dashboard Pages

### Page 1: Overview
- KPI card: Total shows in dataset
- KPI card: Average rating across all shows
- Horizontal bar chart: Top 10 highest rated shows
- Donut chart: Shows by status (ongoing vs ended)

### Page 2: Genre Analysis
- Bar chart: Average rating by genre
- Treemap: Show count by genre
- Line chart: New shows per genre by year

### Page 3: Network Analysis
- Bar chart: Top 15 networks by show count
- Scatter plot: Network show count vs avg rating
- Table: Network name, show count, avg rating

### Page 4: Trends Over Time
- Line chart: Average rating by year (2000–present)
- Bar chart: Number of new shows released per year
- Area chart: Average seasons per show over time

## Step 5 — Refresh Settings
1. In QuickSight go to **Datasets** → select your dataset
2. Click **Schedule refresh**
3. Set to **Daily** at 07:00 AM (1 hour after pipeline runs at 06:00)
4. This keeps your dashboard in sync with the pipeline automatically
