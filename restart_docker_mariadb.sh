#!/bin/bash
SUPPLIED_PSWD=$1
sudo docker stop mariadb \
    && sudo docker rm mariadb \
    && sudo docker run -p 3306:3306 -d --name mariadb \
    -e MYSQL_DATABASE=hockshidbprod \
    -e MARIADB_ROOT_PASSWORD="$SUPPLIED_PSWD" mariadb 
# create prod database
mysql -h 172.17.0.2 -P 3306 -u root -p hockshidbprod < database/sql/hockshidb.sql
# duplicate prod to test
mysql -h 172.17.0.2 -P 3306 -u root -p -e "DROP DATABASE IF EXISTS hockshidbtest; CREATE DATABASE IF NOT EXISTS hockshidbtest;"
# duplicate prod to dev
mysql -h 172.17.0.2 -P 3306 -u root -p -e "DROP DATABASE IF EXISTS hockshidbdev; CREATE DATABASE IF NOT EXISTS hockshidbdev;"
# recreate prod in test and dev
mysql -h 172.17.0.2 -P 3306 -u root -p hockshidbtest < database/sql/hockshidb.sql
mysql -h 172.17.0.2 -P 3306 -u root -p hockshidbdev < database/sql/hockshidb.sql
# session management
mysql -h 172.17.0.2 -P 3306 -u root -p < sessionmanagement/hockshisessiondb.sql


