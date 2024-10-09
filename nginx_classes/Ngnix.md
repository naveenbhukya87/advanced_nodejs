### Nginx [Engine-X]

#### Introduction

- Nginx is a powerful **web server** and uses a non-threaded, event-driven architecture.
- It can also do other important things, such as:
  - **load balancing** and
  - **HTTP caching** or
  - be used as a **reverse proxy**.
  - handling 10,000 concurrent requests.
  - acting as **API Gateway**
  - Serve and cache static files like images, videos etc.
  - handling SSL certificates.
- [USER] ---====Normal HTTP Connection====--> [Server]
- **Forward Proxy**:
  - In forward proxy, multiple users hit same server on behalf of one VPN.
  - Here server doesn't know which user is hitting APIS.
  - [USER(S)] --====[Normal HTTP Connection]====---[VPN]-->[Server]
- **Reverse Proxy**:
  - In forward proxy, single user hits multiple server on behalf of one VPN.
  - Here User doesn't know which server is getting hit.
  - [USER] --====[Normal HTTP Connection]---[NGINX]-->[Server[S]]
- **HTTP Caching**:
  - If user access the some resources which are already accessed previously, then NGINX returns them from the caching. It helps in sending response very fastly.
- **Loading Balance**:
  - Multiple requests are routed to multiple servers.
- **General Scenario**:
  - [USER(s)] ==== [NGINX]====>[Servers]
- **Prerequisites**:
  - Docker
  - Ubuntu
  - AWS

#### Install and setup of Nginx:

- To setup Ubuntu [if not exists, it will pull light-weight ubuntu image and sudo command will not be available]
- **`docker run -it -p 8080:80 ubuntu`** [By default nginx runs on port number: 80 and here we have configured to run on 8080]
- To install nginx and run:
- **`apt-get update`** [to update local packages]
- **`apt-get install nginx`** [to install nginx]
- **`ngnix`** [to run ngnix]
- **check nginx installation**:
  - **`nginx -v`**
  - Open chrome and hit http://localhost:8080 [it redirects to Nginx home page]
  - In response body
  ```
  HTTP/1.1 200 OK
  **Server: nginx/1.24.0 (Ubuntu)**
  Date: Wed, 09 Oct 2024 08:49:59 GMT
  Content-Type: text/plain
  Content-Length: 23
  Connection: keep-alive
  ```
- When nginx is installed, it creates a folder name **nginx** in **etc** folder. In **nginx** folder, there is a file named **nginx.conf** where all the configurations will be there. Do **`apt-get install vim`** to install **vim**.
- **Reload the nginx**:
  - **`nginx -s reload`**
- **To check nginx working fine**
  - **```nginx -t```**
- Default content of **nginx.conf**:

  ```
  user www-data;
  worker_processes auto;
  pid /run/nginx.pid;
  error_log /var/log/nginx/error.log;
  include /etc/nginx/modules-enabled/*.conf;

  events {
          worker_connections 768;
          # multi_accept on;
  }

  http {

          ##
          # Basic Settings
          ##

          sendfile on;
          tcp_nopush on;
          types_hash_max_size 2048;
          # server_tokens off;

          # server_names_hash_bucket_size 64;
          # server_name_in_redirect off;

          include /etc/nginx/mime.types;
          default_type application/octet-stream;

          ##
          # SSL Settings
          ##

          ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; # Dropping SSLv3, ref: POODLE
          ssl_prefer_server_ciphers on;

          ##
          # Logging Settings
          ##

          access_log /var/log/nginx/access.log;

          ##
          # Gzip Settings
          ##

          gzip on;

          # gzip_vary on;
          # gzip_proxied any;
          # gzip_comp_level 6;
          # gzip_buffers 16 8k;
          # gzip_http_version 1.1;
          # gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

          ##
          # Virtual Host Configs
          ##

          include /etc/nginx/conf.d/*.conf;
          include /etc/nginx/sites-enabled/*;
  }


  #mail {
  #       # See sample authentication script at:
  #       # http://wiki.nginx.org/ImapAuthenticateWithApachePhpScript
  #
  #       # auth_http localhost/auth.php;
  #       # pop3_capabilities "TOP" "USER";
  #       # imap_capabilities "IMAP4rev1" "UIDPLUS";
  #
  #       server {
  #               listen     localhost:110;
  #               protocol   pop3;
  #               proxy      on;
  #       }
  #
  #       server {
  #               listen     localhost:143;
  #               protocol   imap;
  #               proxy      on;
  #       }
  #}
  ```

- Keep backup by moving existing data into backup file:
  - `mv nginx.conf nginx-backup.conf`
- Create own nginx.conf file:

  ```
    events {

    }
    http {
        server {
                listen 80;
                server_name **;
                location / {
                    return 200 "Message from nginx configured by govind";
            }
        }
    }
  ```

- now reload nginx and if it throws any error regadring pid, run the following command: **`nginx-c/etc/nginx/nginx.conf`** [created nginx.pid manually]

#### Serving Static Content

- ##### root directory and index files:

  - root directive specifies the root directory that will be used to search for a file.
  - To obtain the path of a requested file, NGINX appends the request URI to the path specified by the root directive.
  - The directive can be placed on any level within the **http {}**, **server {}**, or **location {}** contexts.
  - If a request ends with a slash, NGINX treats it as a request for a directory and tries to find an index file in the directory. The index directive defines the index file's name (the default name is **index.html**)
  - ex: root /www/my_app; location /public/ {.....}
    - now it looks for /www/my_app/public/index.html and returns and if it doesn't exist, NGINX return HTTP code 404 (by default). To configure NGINX to return an automatically generated directory listing instead, include the on parameter to the **autoindex** directive.
  - `vim nginx.conf`

    ```
    events {

    }

    http {
            server {
                listen 80;
                server_name **;
                #location / {
                #   return 200 "Message from nginx configured by govind";
                #}
                root /etc/nginx/my_app
            }
    }
    ```

- ##### types:

  - By default, Nginx is able to detect html file and here it send Content/type as **text/html**
  - If I have created style.css and if I hit **http://localhost:8080/style.css**, now Content/type is **text/plain** but not **text/css**
  - If file extenstion is css, then Content-type should **text/css**
  - If file extenstion is html, then Content-type should **text/html**
  - Configuring file format type explicitly:
    `vim nginx.conf`

    ```
        events {

        }

        http {
        #helps in sending correct file content and if we declare explicitly, then we have declare for all
            types {
            # for css: send as css
                text/css css;
                # for html: send as html
                text/html html;
            }
            server {
                listen 80;
                server_name _;
                root /etc/nginx/my_app;
            }
        }
    ```

  - but there are lot more file formats and writing for all types is not feasible. there are all most used file formats. How to handle this ?
  - **Method:1**
    - In /etc/nginx/mime.types, copy all the content [ text/css css; and so on ...] and paste it in nginx.conf. I
  - **Method:2**
    - replace **types {...}** with **include /etc/nginx/mime.types;**
      ```
          events {

          }
          http {
              include /etc/nginx/mime.types;

              server {
                  listen 80;
                  server_name _;
                  root /etc/nginx/my_app;
              }
          }
      ```
