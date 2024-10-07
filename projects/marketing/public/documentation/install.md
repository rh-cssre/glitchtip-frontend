# GlitchTip Installation Guide

GlitchTip can be run with Docker. We recommend [Docker Compose](documentation/install#docker-compose), [DigitalOcean App Platform](documentation/install#digitalocean-app-platform), [PikaPods](documentation/install#pikapods), or [Elestio](documentation/install#elestio). A [Helm](documentation/install#helm) chart is available for Kubernetes.

Not sure which? Elestio and Pikapods both support GlitchTip via a revenue share program.

### System Requirements

GlitchTip requires PostgreSQL (13+), Redis/Valkey, a web service, and a worker service.

- Recommended system requirements: 1GB RAM, x86 or arm64 CPU
- Minimum system requirements: 512MB RAM + swap

Disk usage varies on usage and event size. As a rough guide, a 1 million event per month instance may require 30GB of disk.

For best performance, use a proxy or load balancer that supports request buffering and handles chunked Transfer-Encoding, such as nginx.

## [Docker Compose](documentation/install#docker-compose)

Docker Compose is a simple way to run GlitchTip on a single server.

1. Install Docker and Docker Compose. On Debian/Ubuntu this is `sudo apt install docker-compose docker.io`
2. Copy [docker-compose.sample.yml](/assets/docker-compose.sample.yml) to your server as `docker-compose.yml`.
3. Edit the environment section of docker-compose.yml. See the Configuration section below.
4. Start docker service `docker compose up -d` now the service should be running on port 8000. Older versions of docker compose should use `docker-compose` without a space.

It's highly recommended configuring SSL next. Use nginx or preferred solution.

### [Recommended nginx and SSL solution](documentation/install#recommended-nginx-and-ssl-solution)

- Install nginx. Ex: `sudo apt install nginx`.
- (on Debian/Ubuntu) edit `/etc/nginx/sites-enabled/default` for example:

```
server {
    server_name glitchtip.example.com;
    access_log  /var/log/nginx/access.log;
    client_max_body_size 40M;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

This configuration will direct glitchtip.example.com to port 8000 (the default GlitchTip docker compose port).

Install and run certbot. Follow [instructions](https://certbot.eff.org/instructions).

#### [Apache2 Alternative](documentation/install#apache2-alternative)

- Install mods header, proxy, proxy_http (`a2enmod`)
- Setup the proxy part in the vhost

```
        ProxyPreserveHost On
        ProxyPass / http://localhost:8000/
        ProxyPassReverse / http://localhost:8000/
        RequestHeader set "X-Forwarded-Proto" expr=%{REQUEST_SCHEME}
        RequestHeader set "X-Forwarded-SSL" expr=%{HTTPS}
```

### [Upgrading](documentation/install#upgrading)

1. Pull latest docker image `docker-compose pull`
1. Restart `docker-compose stop` and `docker-compose up -d`

Database migrations will automatically happen.

## [DigitalOcean App Platform](documentation/install#digitalocean-app-platform)

Get started by clicking here. Note this is a referral link and is a great way to help fund GlitchTip.

<a href="https://cloud.digitalocean.com/apps/new?repo=https://gitlab.com/glitchtip/glitchtip/tree/master&refcode=7e90b8fb37f8">
<img src="https://www.deploytodo.com/do-btn-blue.svg" alt="Deploy to DigitalOcean" style="width:250px;"/>
</a>

Leave environment variables blank and click next. Pick the basic or pro plan. One 512 MB RAM | 1 vCPU is fine to start with. Click Launch. Now copy [app-platform.yaml](https://gitlab.com/glitchtip/glitchtip/-/blob/master/app-platform.yaml) to your local computer. Edit the following

### [Name and region](documentation/install#name-and-region)

This can be anything. We default to "glitchtip" and "nyc".

### [Environment Variables](documentation/install#environment-variables)

At a minimum, set the `SECRET_KEY` to a random string of letters.

See [Configuration](https://glitchtip.com/documentation/install#configuration) for more information.

### [Redis](documentation/install#redis)

GlitchTip requires Redis/Valkey for sending notification, managing events, and more. Go to https://cloud.digitalocean.com/databases/ and create a new redis database. For almost all size instances, the 1 GB RAM | 1 vCPU instance is sufficient. Enter your redis database's name in the glitchtip-redis section. Let's assume it's named "glitchtip-redis". Both "name" and "cluster_name" must be the same value.

```
- name: glitchtip-redis
  engine: REDIS
  production: true
  cluster_name: glitchtip-redis
```

Ensure the environment variable "REDIS_URL" uses the same name. If you didn't name your redis instance "glitchtip-redis" then make sure to update it.

### [Deploying](documentation/install#deploying)

You'll need to install [doctl](https://www.digitalocean.com/docs/apis-clis/doctl/how-to/install/) and log in.

Run `doctl apps list` to get your app's id.

Now apply your app-platform.yaml spec with `doctl apps update 11111111-1111-1111-1111-111111111 --spec app-platform.yaml` (enter your actual id)

After deployment, you should be able to visit the app URL and start using GlitchTip!

### [Production considerations](documentation/install#production-considerations)

If you intend to use GlitchTip in production, consider upgrading your Postgres database to a production instance. In the web interface, go to Manage Components, glitchtip-db, Upgrade to a managed database.

If you haven't already, you'll need to set up email via environment variables.

### [Upgrading GlitchTip](documentation/install#upgrading-glitchtip)

By default, the docker image tag is "latest". Click Deploy to upgrade to the latest GlitchTip docker image.

## [PikaPods](documentation/install#pikapods)

<a href="https://www.pikapods.com/pods?run=glitchtip">
<img src="https://www.pikapods.com/static/run-button.svg" alt="Run on PikaPods" style="width:200px;"/>
</a>

PikaPods is an affordable and managed hosting provider aimed at running open source applications.

Sign up and run GlitchTip on PikaPods [here](https://www.pikapods.com/pods?run=glitchtip). Set the required environment variables including `EMAIL_URL`. If you don't need email, you may set it to `consolemail://` and email will output to logs. See configuration [docs](https://glitchtip.com/documentation/install#configuration).

## [Elestio](documentation/install#elestio)

<a href="https://elest.io/open-source/glitchtip">
<img src="https://github.com/elestio-examples/glitchtip/raw/main/deploy-on-elestio.png" alt="Run on Elestio" style="width:200px;"/>
</a>

Elestio is a managed hosting provider that supports multiple cloud providers, many worldwide regions, and on-premise. Elestio comes with email server support out of box, making it easier to configure.

Sign up and run GlitchTip on Elestio [here](https://elest.io/open-source/glitchtip). They have detailed documentation about [running GlitchTip](https://elest.io/open-source/glitchtip/resources/installation-guide). Consider adding a volume if you plan to store many events. After setting it up, go to the service URL, login, and create an organization.

### Upgrading and Configuration

Elestio, by default, will configure and upgrade GlitchTip for you. Larger or complex instances may benefit from adjusting the configuration via environment variables. To edit these, go to your GlitchTip service, Overview, Software, Update config. The syntax is the same as Docker Compose.

See configuration [docs](https://glitchtip.com/documentation/install#configuration).

## [Helm](documentation/install#helm)

Installing GlitchTip with Helm for Kubernetes is a good option for high throughput sites and users who are very comfortable using Kubernetes.

app.glitchtip.com uses this method with a managed DigitalOcean database.

1. Add our Helm chart repo `helm repo add glitchtip https://gitlab.com/api/v4/projects/16325141/packages/helm/stable`
2. Review our [values.yaml](https://gitlab.com/glitchtip/glitchtip-helm-chart/-/blob/master/values.yaml) and [values.sample.yaml](https://gitlab.com/glitchtip/glitchtip-helm-chart/-/blob/master/values.sample.yaml). At a minimum, decide if using helm postgresql and set env.secret.SECRET_KEY
3. Install the chart `helm install glitchtip glitchtip/glitchtip -f your-values.yaml`. You'll need to specify your own values.yml file or make use of `--set`.

For postgresql, we recommend an externally managed database and providing only the `DATABASE_URL` environment variable. If using helm managed postgresql, then make sure to consider:

- If you uninstall the chart, it will not delete the pvc. If you reinstall the chart, it won't have the correct password because of this.
- postgresql helm chart does not support major upgrades (such as 14.0 to 15.0). It will fail to start. You could export to a sql file and import if downtime is acceptable. Minor updates are supported.

For high availability, production servers we recommend using multiple Kubernetes Nodes, an ingress and/or load balancer, a pod disruption budget, anti-affinity, and a managed PostgreSQL high availability database.

## [Installing Without Docker](documentation/install#installing-without-docker)

This method is not recommended and assumes the reader knows how to deploy Django, Celery, SSL, and a web server. It requires manual upgrades.

1. `git clone` or download the latest Django backend [release tag](https://gitlab.com/glitchtip/glitchtip-backend/-/tags). Take note of the version number.
2. Download the latest frontend code at `wget https://gitlab.com/api/v4/projects/15449363/jobs/artifacts/<VERSION HERE>/download?job=build-assets -O assets.zip`. Replace the VERSION HERE with the same version from step 1. It must be exact, including the "v".
3. Extract the zip file and move the `dist/glitchtip-frontend` directory to the glitchtip-backend's dist folder. If you installed glitchtip to `/opt/glitchtip` then this might look like `unzip assets.zip; mv dist/glitchtip-frontend /opt/glitchtip/dist`. Note this step involves removing the directory called "glitchtip-frontend".
4. Create a Python virtual environment (or other preferred way to run Python). Install [Poetry](https://python-poetry.org/) and run `poetry install` to install Python dependencies.
5. Set required [environment variables](https://glitchtip.com/documentation/install#configuration).
6. Migrate the database with `./manage.py migrate`
7. Collect static files `./manage.py collectstatic`
8. Configure Django uWSGI application with your favorite web server such as nginx or apache. Ensure SSL is configured.
9. Start celery with preferred init system. For example systemd or supervisor.

To upgrade, follow the same steps with the latest version tag. Include migrating the database and collectstatic.

# [Configuration](documentation/install#configuration)

Required environment variables:

- `SECRET_KEY` set to any random string
- Set up email:
- `EMAIL_URL`: SMTP string. It will look something like `"smtp://email:password@smtp_url:port"`. See format examples [here](https://django-environ.readthedocs.io/en/latest/tips.html#email-settings). Pay extra attention if the URL contains unsafe characters (eg. @ or /) and see how to handle them [in django-environ's documentation](https://django-environ.readthedocs.io/en/latest/tips.html#using-unsafe-characters-in-urls)
- Alternatively, use the Mailgun API by setting `MAILGUN_API_KEY`. Set `EMAIL_BACKEND` to `anymail.backends.mailgun.EmailBackend`. For more look [here](https://anymail.dev/en/stable/esps/mailgun/).
- Alternatively, use the SendGrid API by setting `SENDGRID_API_KEY`. Set `EMAIL_BACKEND` to `anymail.backends.sendgrid.EmailBackend`.
- `DEFAULT_FROM_EMAIL` Default from email address. Example `info@example.com`
- `GLITCHTIP_DOMAIN` Set to your domain. Include scheme (http or https). Example: `https://glitchtip.example.com`.

Optional environment variables:

- `I_PAID_FOR_GLITCHTIP` [Donate](https://liberapay.com/GlitchTip/donate), set this to "true", and some neat things will happen. This won't enable extra features but it will enable our team to continue building GlitchTip. We pay programmers, designers, illustrators, and free tier hosting on app.glitchtip.com without venture capital. We ask that all self-host users pitch in with a suggested donation of $5 per month per user. Prefer an invoice and support instead? Business users can also consider a paid support plan. Reach out to us at sales@glitchtip.com. Contributors on [Gitlab](https://gitlab.com/glitchtip) should also enable this.
- `GLITCHTIP_MAX_EVENT_LIFE_DAYS` (Default 90) Events and associated data older than this will be deleted.
- `GLITCHTIP_MAX_TRANSACTION_EVENT_LIFE_DAYS` (Default to max event life days) Transaction events older than this will be deleted.
- `GLITCHTIP_MAX_FILE_LIFE_DAYS` (Defaults to 2 \* max event life days) Files older than this will be deleted. Files with any reference to a recent event are excluded. For example, a year old file that is used for an active release with event data, will not be deleted.
- `REDIS_URL` Set redis/valkey host explicitly. Example: `redis://:password@host:port/database`. You may also set them separately with `REDIS_HOST`, `REDIS_PORT`, `REDIS_DATABASE`, and `REDIS_PASSWORD`.
- `DATABASE_URL` Set PostgreSQL connect string. PostgreSQL 11 and above are supported.
- `CELERY_BROKER_URL` set celery broker url explicitly. Defaults to `REDIS_URL`
- `CACHE_URL` use alternative cache backend for django, defaults to `REDIS_URL`
- Content Security Policy (CSP) headers are enabled by default. In most cases there is no need to change these. However, you may add environment variables as documented in [django-csp](https://django-csp.readthedocs.io/en/latest/configuration.html#policy-settings) to modify them. For example, set `CSP_DEFAULT_SRC='self',scripts.example.com` to modify the default CSP header. Note the usage of comma separated values and single quotes on certain values such as 'self'.
- `ENABLE_USER_REGISTRATION` (Default True) When True, any user will be able to register. When False, user self-signup is disabled after the first user is registered. Subsequent users must be created by a superuser on the backend and organization invitations may only be sent to existing users.
- `ENABLE_ORGANIZATION_CREATION` (Default False) When False, only superusers will be able to create new organizations after the first. When True, any user can create a new organization.

### [Server configuration](documentation/install#server-configuration)

Scaling GlitchTip? Review these uWSGI (web server) and Celery (worker) environment variables.

- `UWSGI_WORKERS` - Number of web workers. Or Maximum number of workers when scaling.
- `UWSGI_CHEAPER` - Minimum number of web workers when scaling.
- `UWSGI_CHEAPER_INITIAL` - Initial number of web workers when scaling.

See [more information](https://uwsgi-docs.readthedocs.io/en/latest/Configuration.html/) on uWSGI configuration.

- `CELERY_WORKER_CONCURRENCY` - Number of concurrent celery workers. Defaults to number of CPU cores. Highly recommended to change. Our sample docker compose file defaults this to 2, to avoid unwanted and unnecessary scaling.
- `CELERY_WORKER_AUTOSCALE` - Set to min,max concurrency scaling. Overrides CELERY_WORKER_CONCURRENCY. Example: 2,8 would instruct Celery to run between 2 and 8 concurrent workers. Memory is released when scaling down. Defaults to disabled.

See [more information](https://docs.celeryq.dev/en/stable/django/first-steps-with-django.html) on Celery configuration.

### [Advanced settings for cache and celery](documentation/install#advanced-settings-for-cache-and-celery)

By default, redis/valkey is used for the celery broker and cache. It's possible to use cache (and thus redis) for sessions, but is disabled by default in favor of PostgreSQL. At this time, redis data is important to be available but is not necessarily worth backing up.

- `SESSION_ENGINE` Controls where Django stores session data [See Django documentation](https://docs.djangoproject.com/en/4.0/ref/settings/#std-setting-SESSION_ENGINE). To make this use redis, set to `"django.contrib.sessions.backends.cache"`.
- `SESSION_COOKIE_AGE` The age of session cookies, in seconds. Defaults to [Django default](https://docs.djangoproject.com/en/4.0/ref/settings/#std-setting-SESSION_COOKIE_AGE)

If using Redis Sentinel, additional settings are required. `REDIS_URL` will not work with Sentinel. Set the following:

- `CELERY_BROKER_URL` Example: `"sentinel://:<password>@redis:26379/0"`. Note the sentinel protocol. See [Celery documentation](https://docs.celeryq.dev/en/stable/getting-started/backends-and-brokers/redis.html).
- `CELERY_BROKER_MASTER_NAME` Set to the master name. Defaults to the upstream default `mymaster`.
- `CELERY_BROKER_SENTINEL_KWARGS_PASSWORD` Set when using a password with Redis Sentinel
- `CACHE_URL` Example `"redis://mymaster/1?client_class=django_redis.client.SentinelClient&connection_pool_class=redis.sentinel.SentinelConnectionPool&password=<password>` Password may be omitted if not using one. See [django-redis documentation](https://github.com/jazzband/django-redis). Take note how settings such as "PARSER_CLASS" map via the query parameter "parserClass".
- `CACHE_SENTINEL_URL` Set to host:port of the sentinel instance. Do not include the protocol nor password. For example `redis:26379`.
- `CACHE_SENTINEL_PASSWORD` Set when using a password with Redis Sentinel

Other Celery broker and cache types may work but are not tested. Consider submitting a merge request to add support for your preferred solution.

### [File storage](documentation/install#file-storage)

Storage is necessary to enable file uploads, such as sourcemaps. GlitchTip can support both local storage and remote storage via [django-storages](https://django-storages.readthedocs.io/en/latest/).

GlitchTip maps environment variables to django-storages configuration. If you find that your configuration option is supported by django-storages but not GlitchTip, please submit a [merge request](https://gitlab.com/glitchtip/glitchtip-backend/-/merge_requests).

#### AWS S3 or DigitalOcean Spaces

[django-storages S3 documentation](https://django-storages.readthedocs.io/en/latest/backends/amazon-S3.html)

- `DEFAULT_FILE_STORAGE` - `storages.backends.s3boto3.S3Boto3Storage`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_STORAGE_BUCKET_NAME`
- `AWS_S3_ENDPOINT_URL` - Necessary if using DigitalOcean Spaces. Set to `https://<your-region>.digitaloceanspaces.com`

#### Azure Blob Storage

[django-storages Azure documentation](https://django-storages.readthedocs.io/en/latest/backends/azure.html)

- `DEFAULT_FILE_STORAGE` - `storages.backends.azure_storage.AzureStorage`
- `AZURE_ACCOUNT_NAME`
- `AZURE_ACCOUNT_KEY`
- `AZURE_CONTAINER`
- `AZURE_URL_EXPIRATION_SECS` - Set if not using public ACL

#### Google Cloud Storage

[django-storages Google Cloud documentation](https://django-storages.readthedocs.io/en/latest/backends/gcloud.html)

- `DEFAULT_FILE_STORAGE` - `storages.backends.gcloud.GoogleCloudStorage`
- `GS_BUCKET_NAME`
- `GS_PROJECT_ID`
- `GOOGLE_APPLICATION_CREDENTIALS`

#### Local Docker Volume

For local storage with Docker, use a volume. Refer to Kubernetes or Docker Compose documentation on creating volumes. In the future, docker-compose examples with volumes will be provided by default.

### [Search Language](documentation/install#search-language)

GlitchTip uses PostgreSQL full-text search. It will use the default PostgreSQL "text_search_config". In most cases there is no need to modify this. However, you may wish to change it as described [here](https://www.postgresql.org/docs/13/textsearch-configuration.html). This only affects search terms, it does not affect the site language. For example, if your preferred reading language is French and your code and user base uses English, you should pick English.

## [Django Admin](documentation/install#django-admin)

Django Admin is not necessary for most users. However, if you'd like the ability to fully manage users beyond what our frontend offers, it may be useful. To enable, create a superuser via the Django command

`./manage.py createsuperuser`

Then go to `/admin/` and log in.

### [Social Authentication (OAuth)](documentation/install#social-authentication-oauth)

You may add Social Accounts in Django Admin at `/admin/socialaccount/socialapp/`. GlitchTip supports the following providers though django-allauth:

- [DigitalOcean](https://docs.allauth.org/en/latest/socialaccount/providers/digitalocean.html)
- [Gitea](https://docs.allauth.org/en/latest/socialaccount/providers/gitea.html)
- [Github](https://docs.allauth.org/en/latest/socialaccount/providers/github.html)
- [Gitlab](https://docs.allauth.org/en/latest/socialaccount/providers/gitlab.html)
- [Google](https://docs.allauth.org/en/latest/socialaccount/providers/google.html)
- [Microsoft](https://docs.allauth.org/en/latest/socialaccount/providers/microsoft.html)
- [NextCloud](https://docs.allauth.org/en/latest/socialaccount/providers/nextcloud.html)
- [OpenID Connect](https://docs.allauth.org/en/latest/socialaccount/providers/openid_connect.html)

The callback endpoint URL has to be set on `/accounts/<provider name>/login/callback/` where `<provider name>` is a name of the login provider. For example `https://example.com/accounts/github/login/callback/`.

#### Configuring OpenID Connect based SSO

Many identity providers (IDPs), like [Keycloak](https://docs.allauth.org/en/latest/socialaccount/providers/keycloak.html),
could be configured using OpenID Connect provider.

To do that, navigate to `/admin/socialaccount/socialapp/` as mentioned above, click `Add social application` and:

- in `Provider` select `OpenID Connect`
- in `Provider ID` enter the preferred machine name for your identity provider, eg `my-idp`
- in `Name` enter the provider name that will be visible to end users
- in `Client id` enter the application ID assigned (registered) in IDP
- in `Secret key` enter the API secret, client secret, or consumer secret generated in IDP
- in `Settings` enter JSON object, with the required fields filled in (`server_url` is mandatory), eg:
  ```json
  { "server_url": "https://my-idp.example.com/auth/realms/my-realm/.well-known/openid-configuration" }
  ```

# Custom domain and settings

It's possible to edit django-allauth settings via environment variables. The following are supported.

- `SOCIALACCOUNT_PROVIDERS_gitlab_GITLAB_URL`
- `SOCIALACCOUNT_PROVIDERS_gitea_GITEA_URL`
- `SOCIALACCOUNT_PROVIDERS_nextcloud_SERVER`

For more information, refer to django-allauth's [providers documentation](https://django-allauth.readthedocs.io/en/latest/socialaccount/providers/index.html). If your OAuth provider or a needed configuration option is supported by django-allauth but not GlitchTip, please open a merge request to add support.
