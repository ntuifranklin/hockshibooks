sudo docker stop mariadb && sudo docker rm mariadb && sudo docker run -p 3306:3306 -d --name mariadb \
 -e MYSQL_DATABASE=hockshi \
 -e MARIADB_ROOT_PASSWORD=SEE_ENV_SECRET mariadb
mysql -h 172.17.0.2 -P 3306 -u root -p < database/sql/hockshidb.sql