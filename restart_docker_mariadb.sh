#!/bin/bash
SUPPLIED_PSWD=$1
# echo "Password supplied is $SUPPLIED_PSWD"
echo "Container will be stopped, removed and re run with aan additional sleep of 20 seconds"
sudo docker stop mariadb \
    && echo "Stopped container" \
    && echo "Sleeping for 5 seconds" \
    && sleep 5 \
    && sudo docker rm mariadb \
    && echo "Removed container" \
    && echo "Sleeping for 5 seconds" \
    && sleep 5 \
    && sudo docker run --restart always -p 3306:3306 -d --name mariadb \
    -e MYSQL_DATABASE=hockshidbprod \
    -e MARIADB_ROOT_PASSWORD="$SUPPLIED_PSWD" mariadb \
    && echo "Re-Ran container" \
    && sleep 5

status=$?
sleep 5
echo "Sleeping for another 5 seconds. Status or stopping, deleting and re running container is $status"
echo "Creating databases"

# create prod database
mysql -h 172.17.0.2 -P 3306 -u root -p hockshidbprod < database/sql/hockshidb.sql

# copy data to prod database
mysql -h 172.17.0.2 -P 3306 -u root -p hockshidbprod < database/sql/data_no_books.sql

# copy books data to prod database
mysql -h 172.17.0.2 -P 3306 -u root -p hockshidbprod < database/sql/books_and_inventory.sql

# drop and create dev database
mysql -h 172.17.0.2 -P 3306 -u root -p -e "DROP DATABASE IF EXISTS hockshidbdev; CREATE DATABASE IF NOT EXISTS hockshidbdev;"
# create table statements
mysql -h 172.17.0.2 -P 3306 -u root -p hockshidbdev < database/sql/hockshidb.sql

# copy data to dev database
mysql -h 172.17.0.2 -P 3306 -u root -p hockshidbdev < database/sql/data_no_books.sql

# copy books data to dev database
mysql -h 172.17.0.2 -P 3306 -u root -p hockshidbdev < database/sql/books_and_inventory.sql

# create test database
# We need the books table in test to be empty, so we do not copy books data to test database
# However we need the country states, admin users etc to be present in the test database
# we have a testdata for that
mysql -h 172.17.0.2 -P 3306 -u root -p -e "DROP DATABASE IF EXISTS hockshidbtest; CREATE DATABASE IF NOT EXISTS hockshidbtest;"
# create table statements in test database
mysql -h 172.17.0.2 -P 3306 -u root -p hockshidbtest < database/sql/hockshidb.sql
#copy minimal data needed for test
mysql -h 172.17.0.2 -P 3306 -u root -p hockshidbtest < database/sql/data_no_books.sql

# session management
mysql -h 172.17.0.2 -P 3306 -u root -p < sessionmanagement/hockshisessiondb.sql