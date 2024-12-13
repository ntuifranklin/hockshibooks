# hockshi
hockshi is an online used book store for selling used books online.  
This guide provides detailed instructions for deploying the Hockshi application.

# Deployment Guide

## Requirements
Requires a linux server that has at least 8 GB of memory, and 2 cpu cores totalling at least 3.2 Giga Hertz of speed.  
The 2 cores will be helful for clustering as the app was deisgned with paralellism in mind.

## Installation Instructions

### Update the system.  
```{sh}
sudo apt update -y
```
---  

### Make sur git is installed
```{sh}
sudo apt install git -y
```
---  

### Clone the web app into the `~/www` location
```{sh}
git clone <url_to_git_repo>
```

### Install `node, npm, docker.io, nginx, mysql-client`, then start and enable docker
```{sh}
sudo apt install node npm docker.io nginx mysql-client
```
---- 

### Start and enable docker.  
```{sh}
sudo systemctl start docker
sudo systemctl enable docker
```

### Install Redis: check [here](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-linux/) for an updated installation instructions
```{sh}
sudo apt-get install lsb-release curl gpg
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
sudo chmod 644 /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
sudo apt-get update
sudo apt-get install redis
```
----  

### Redis should start automatically, and it should restart at boot time.  
If not run the following:

```{sh}
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

### Setting up the database
The database used is a mariadb server in a docker container.


#### Create the `.env` file and place all variables in there
An env file containing all the secrets is necessary.

```{sh}
# I want to delete all values in this file and replace them with empty strings
# so that I can use this file as a template for the .env file in the root directory
# of the project
# I will use this file as a template for the .env file in the root directory of the project

TEST_PORT=
PRODUCTION_SITE_PORT=
ROOT_PATH=

PRODUCTION_ENV=""
DEVELOPMENT_ENV=""
TEST_ENV=""

# maybe generate stronger password using 
# linux command :  openssl rand -base64 <num_bytes>
# DB_PSWD="Password123!"
DB_PSWD_SECURE=""

# add another mariadb/mysql user with another name different from user root

# development db settings
DB_DEV_USER=""
DB_DEV_PASSWORD=""
DB_DEV_DB_NAME=""
DB_DEV_HOST=""

# testing db settings
DB_TEST_USER=""
DB_TEST_PASSWORD=""
DB_TEST_DB_NAME=""
DB_TEST_HOST=""

# production db settings
DB_PROD_USER=""
DB_PROD_PASSWORD=""
DB_PROD_DB_NAME=""
DB_PROD_HOST=""


# the root user tends to be usedfor brute force attacks all the time
DB_USER=""
DB_PSWD=""
DB_NAME=""
DB_HOST=""
HOST="https://hockshi.com"
NODE_ENV="TEST"
SESSION_MAXIMUM_TIME_IN_MILLI_SECONDS=86400000 #1 day is 86400000, 3 days: 259200000 
# To protect admin/developer's personal stripe account
# make sure this is from a stripe account with a website email and 
# not a personal email 
# Stripe 
SITE_SECRET=""



# stripe keys
STRIPE_SECRET_KEY=""
STRIPE_PUBLIC_KEY=""

# production stripe keys
PRODUCTION_STRIPE_PUBLIC_KEY=""
PRODUCTION_STRIPE_SECRET_KEY=""

# dev stripe keys
DEVELOPMENT_STRIPE_PUBLIC_KEY="pk_test_51Or8CFA8wUPGzCHgBkpL2BNANveKd29n98xrZmg0NLXgE3zOoQXqr06qtXcPSpt5I3ZSQHAbBXS6BGwvzltKvnuL00itnrUe9i"
DEVELOPMENT_STRIPE_SECRET_KEY="sk_test_51Or8CFA8wUPGzCHgOqhMp29nbE5Q8MtHOEjCPTJgAlPw7UFWx4jj9WmnC2lFLAjXW3cXGjF2wZEzRtORdO3ibzqG00hvTJiwis"


# comes from gmail app pass
EMAIL_USER=""
EMAIL_PASS=""

HOCKSHI_GMAIL_APP_USER=""
HOCKSHI_GMAIL_APP_PASSWORD=""

# temporary added email parameters for testing
IMAP_MAIL_SERVER=''
IMAP_PORT=
SMTP_MAIL_SERVER=''
SMTP_SECURITY='TLS'
SMTP_PORT=465
IMAP_SECURITY='TLS'
IMAP_USERNAME_EMAIL=''
IMAP_PASSWORD=''
SMTP_USERNAME_EMAIL=''
SMTP_PASSWORD=''
CUSTOMER_BUSINESS_EMAIL=""

#ROUTES
ADMIN_ROUTE="/admin"

CUSTOMER_ROUTE="/"

ADMIN_ORDERS_ROUTE="/order"

ADMIN_BOOKS_ROUTE="/books"

#COMPANY DETAILS

WEBSITE_URL="https://hockshi.com"
COMPANY_NAME="Hockshi.com"
COMPANY_CITY="Washington"
COMPANY_STATE="DC"
COMPANY_ZIP="20009"

COMPANY_ADDRESS="$COMPANY_NAME, $COMPANY_CITY, $COMPANY_STATE $COMPANY_ZIP"
COMPANY_PHONE_NUMBER=""

FACEBOOK_PAGE="https://facebook.com/"
X_PAGE="https://x.com/"
INSTAGRAM_PAGE="https://instagram.com/"
LINKEDIN_PAGE="https://linkedin.com/"

# Terms and Conditions, and Refund Policy
SHIPPING_DAYS="5-12"
BUYER_REFUND_POLICY_DEADLINE_DAYS="15"
ACCEPTED_PAYMENT_METHODS="Visa, Mastercard, American Express, Discover, Apple Pay, Google Pay, and PayPal"
SELLER_CHARGED_COMMISSION="3"
# redis 
ADMIN_USER_EXPIRE_TIME=900
REDIS_URI="redis://localhost:6379"
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_USER="mamadou_et_benita"
REDIS_PASSWORD=""
REDIS_DB_INDEX=0
REDIS_TTL=900
REDIS_PREFIX="hockshi"

# TERMS AND CONDITIONS
MINIMUM_USER_AGE=18
COMPANY_JURISDICTION="Washington, DC"

# Sessions 
SESSION_DATABASE_HOST=""
SESSION_DATABASE_PORT=
SESSION_DATABASE_USER=""
SESSION_DATABASE_PASSWORD=""
SESSION_DATABASE_NAME=""
#15 minutes is 900000 milliseconds
MYSQL_SESSION_MAXIMUM_EXPIRE_TIME_IN_MILLI_SECONDS=900000


# Testing
TEST_VALID_POWER_USER_ID="",
TEST_VALID_POWER_USER_EMAIL=""
TEST_VALID_POWER_USER_PASSWORD=""

```

#### Launch the database server 
```{sh}
chmod ug+x ./restart_docker_mariadb.sh
restart_docker_mariadb.sh <MARIA_DB_ROOT_PASSWORD>
```

Don't forget to replace the environment variables in <restart_docker_mariadb.sh> with their actual values set in secrets.  
----  

Make sure mariadb server is attached to IP `172.17.0.2`.
`docker inspect <mariadb_container_name>` should return some json
```{sh}
docker inspect <mariadb_container_name>
```
returns 
```{json}
[
    {
        "Id": "68c29b06185cce3ac5276ec3afef32c02df69eff2470065c30f0c701577cb830",
        "Created": "2024-11-10T13:14:11.964944142Z",
        "Path": "docker-entrypoint.sh",
        "Args": [
            "mariadbd"
        ],
        "State": {
            "Status": "running",
            "Running": true,
            "Paused": false,
            "Restarting": false,
            "OOMKilled": false,
            "Dead": false,
            "Pid": 2771,
            "ExitCode": 0,
            "Error": "",
            "StartedAt": "2024-11-10T13:14:12.482960848Z",
            "FinishedAt": "0001-01-01T00:00:00Z"
        },
        ... <truncated to save space>
    }
]
```


# Testing

You need to fill in the values of env variables :
```{sh}
DB_USER=""
DB_NAME=""
DB_HOST=""
DB_PSWD=""
```
 above for the testing module to see the env value.

For some reason setting them dynamically does not workat the moment with testing.  
It works with dev and prod


#### Install required dependencies
```{sh}
npm install .
```

#### Install pm2 globally
```{sh}
npm install pm2 -g
```

#### Start the clusters
```{sh}
pm2 start appclustering.js --name hockshi_cluster --watch
pm2 startup
```

Running `pm2 startup` as the last command above should return something similar to the below:  
```{sh}
# [PM2] Init System found: systemd
# [PM2] To setup the Startup Script, copy/paste the following command:
sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u <current_logged_in_user> --hp /home/<current_logged_in_user>
```

Then run the specified command by just copying what your terminal has anc paste to the terminal:  
```{sh}
sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u <current_logged_in_user> --hp /home/<current_logged_in_user>
```

#### Configure nginx

```{sh}
server {
    listen 80;
    server_name hockshi.com;

    location / {
        proxy_pass http://localhost:<port_number_node_is_running on>;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Place the above at `/etc/nginx/sites-available/<whatevernameyouchoose>.<whateverextension>`.   

#### Enable SSL/TLS with `letsencrypt.org`.
Check the following for an updated installation of a fresh certificate :  
- [Instructions to Install Snap on ubuntu](https://snapcraft.io/docs/installing-snap-on-ubuntu) ( 18.04 and pwards comes with it by default).  
- [Install Certbot and voila](https://certbot.eff.org/instructions?ws=nginx&os=snap)
```{sh}
sudo apt update 
sudo apt install snapd
sudo snap install hello-world
# hello-world 6.4 from Canonical✓ installed
hello-world
# Hello World!
```

- Install certbot
```{sh}
sudo snap install --classic certbot
```

- Prepare the Certbot command
```{sh}
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```
- Either 
Get your certificates and install them
```{sh}
sudo certbot --nginx
```

- Or Just get your certificates
```{sh}
sudo certbot certonly --nginx
```

- Test automatic renewal
```{sh}
sudo certbot renew --dry-run
```

#### Confirm that the website has https
Head to https://hockshi.com/ and make sure you see https instead of http.

#### Update nignx config file
Most often certbot has already updated the file `/etc/nginx/sites-available/hockshi.conf` by adding something similar to:
```{sh}
server {
    listen 443 ssl;
    server_name hockshi.com,www.hockshi.com;

        ssl_certificate /etc/letsencrypt/live/hockshi.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/hockshi.com/privkey.pem;

    location / {
        proxy_pass http://localhost:<port_node_is_running_on>;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

}

```

#### Test Nginx
```{sh}
sudo nginx -t 
```

#### Reload Nginx
```{sh}
sudo systemctl reload nginx
```

