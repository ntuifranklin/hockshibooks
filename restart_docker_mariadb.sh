#!/bin/bash
SUPPLIED_PSWD=$1
sudo docker stop mariadb \
    && sudo docker rm mariadb \
    && sudo docker run -p 3306:3306 -d --name mariadb \
    -e MYSQL_DATABASE=hockshidbprod \
    -e MARIADB_ROOT_PASSWORD="$SUPPLIED_PSWD" mariadb 
# create prod database
mysql -h 172.17.0.2 -P 3306 -u root -p hockshidbprod < database/sql/hockshidb.sql
# copy data to prod database
mysql -h 172.17.0.2 -P 3306 -u root -p hockshidbprod < database/sql/data.sql

# drop and create dev database
mysql -h 172.17.0.2 -P 3306 -u root -p -e "DROP DATABASE IF EXISTS hockshidbdev; CREATE DATABASE IF NOT EXISTS hockshidbdev;"
# create table statements
mysql -h 172.17.0.2 -P 3306 -u root -p hockshidbdev < database/sql/hockshidb.sql
# copy data to dev database
mysql -h 172.17.0.2 -P 3306 -u root -p hockshidbdev < database/sql/data.sql

# create test database
# We need the books table in test to be empty, so we do not copy books data to test database
# However we need the country states, admin users etc to be present in the test database
# we have a testdata for that
mysql -h 172.17.0.2 -P 3306 -u root -p -e "DROP DATABASE IF EXISTS hockshidbtest; CREATE DATABASE IF NOT EXISTS hockshidbtest;"
# create table statements in test database
mysql -h 172.17.0.2 -P 3306 -u root -p hockshidbtest < database/sql/hockshidb.sql
#copy minimal data needed for test
mysql -h 172.17.0.2 -P 3306 -u root -p hockshidbtest < database/sql/testdata_with_no_books.sql

# session management
mysql -h 172.17.0.2 -P 3306 -u root -p < sessionmanagement/hockshisessiondb.sql