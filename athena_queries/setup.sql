-- ============================================
-- TV Analytics Pipeline - Athena Setup
-- Run these queries in AWS Athena console
-- in order (1 through 5)
-- ============================================

-- 1. Create database
CREATE DATABASE IF NOT EXISTS tv_analytics;

-- ============================================

-- 2. Create shows table
-- Replace YOUR-BUCKET-NAME with your actual bucket name
CREATE EXTERNAL TABLE IF NOT EXISTS tv_analytics.shows (
    show_id             INT,
    name                STRING,
    original_language   STRING,
    status              STRING,
    type                STRING,
    first_air_date      DATE,
    last_air_date       DATE,
    number_of_seasons   INT,
    number_of_episodes  INT,
    vote_average        DOUBLE,
    vote_count          INT,
    popularity          DOUBLE,
    content_rating      STRING,
    overview            STRING,
    year_started        INT,
    is_ongoing          BOOLEAN,
    pipeline_load_date  STRING
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION 's3://tv-analytics-pipeline/data/shows/'
TBLPROPERTIES ('skip.header.line.count'='1');

-- ============================================

-- 3. Create genres table
CREATE EXTERNAL TABLE IF NOT EXISTS tv_analytics.genres (
    show_id     INT,
    genre_id    INT,
    genre_name  STRING
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION 's3://tv-analytics-pipeline/data/genres/'
TBLPROPERTIES ('skip.header.line.count'='1');

-- ============================================

-- 4. Create networks table
CREATE EXTERNAL TABLE IF NOT EXISTS tv_analytics.networks (
    show_id         INT,
    network_id      INT,
    network_name    STRING,
    origin_country  STRING
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION 's3://tv-analytics-pipeline/data/networks/'
TBLPROPERTIES ('skip.header.line.count'='1');

-- ============================================

-- 5. Create episodes/seasons table
CREATE EXTERNAL TABLE IF NOT EXISTS tv_analytics.episodes (
    show_id         INT,
    season_number   INT,
    episode_count   INT,
    air_date        DATE,
    vote_average    DOUBLE
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION 's3://tv-analytics-pipeline/data/episodes/'
TBLPROPERTIES ('skip.header.line.count'='1');

-- ============================================
-- ANALYSIS QUERIES (for Power BI / exploration)
-- ============================================

-- Top 20 highest rated shows (min 100 votes)
SELECT name, vote_average, vote_count, year_started, status
FROM tv_analytics.shows
WHERE vote_count >= 100
ORDER BY vote_average DESC
LIMIT 20;

-- Average rating by genre
SELECT g.genre_name, 
       ROUND(AVG(s.vote_average), 2) AS avg_rating,
       COUNT(DISTINCT s.show_id) AS show_count
FROM tv_analytics.shows s
JOIN tv_analytics.genres g ON s.show_id = g.show_id
WHERE s.vote_count >= 50
GROUP BY g.genre_name
ORDER BY avg_rating DESC;

-- Top networks by number of shows
SELECT n.network_name,
       COUNT(DISTINCT n.show_id) AS show_count,
       ROUND(AVG(s.vote_average), 2) AS avg_rating
FROM tv_analytics.networks n
JOIN tv_analytics.shows s ON n.show_id = s.show_id
GROUP BY n.network_name
ORDER BY show_count DESC
LIMIT 20;

-- Rating trends by year
SELECT year_started,
       COUNT(*) AS shows_released,
       ROUND(AVG(vote_average), 2) AS avg_rating,
       ROUND(AVG(CAST(number_of_seasons AS DOUBLE)), 1) AS avg_seasons
FROM tv_analytics.shows
WHERE year_started >= 2000 AND year_started IS NOT NULL
GROUP BY year_started
ORDER BY year_started DESC;

-- Ongoing vs ended shows breakdown
SELECT status,
       COUNT(*) AS count,
       ROUND(AVG(vote_average), 2) AS avg_rating
FROM tv_analytics.shows
GROUP BY status
ORDER BY count DESC;
