# GlitchTip Installation Guide

GlitchTip can be run with Docker. We recommend [Docker Compose](documentation/install#docker-compose), [PikaPods](documentation/install#pikapods), [Elestio](documentation/install#elestio), [Nodion](documentation/install#nodion), [Railway](documentation/install#railway), or [RepoCloud](documentation/install#repocloud). A [Helm](documentation/install#helm) chart is available for Kubernetes.

Not sure which? Elestio, Pikapods, and Nodion all support GlitchTip via a revenue share program.

### System Requirements

GlitchTip requires PostgreSQL (14+), a web service, and a worker service. Valkey (or redis) 7+ is optional.

- Recommended system requirements: 512 MB RAM, x86 or arm64 CPU
- Minimum system requirements: 256 MB RAM when using all-in-one setup. Careful configuration will allow 128 MB + swap.

Disk usage varies on usage and event size. As a rough guide, a 1 million event per month instance may require 30GB of disk.

For best performance, use a proxy or load balancer that supports request buffering and handles chunked Transfer-Encoding, such as nginx. Enable Valkey for faster or larger instances.

## Docker Compose

Docker Compose is a simple way to run GlitchTip on a single server.

1. Install Docker and Docker Compose. On Debian/Ubuntu this is `sudo apt install docker-compose docker.io`
2. Copy [compose.sample.yml](/assets/compose.sample.yml) or [compose.minimal.yml](/assets/compose.minimal.yml) to your server as `compose.yml`. Use "sample" for a more scalable and robust installation. Use "minimal" for trial or small instances when you want the lightest system requirements possible. Minimal omits Valkey and uses an all-in-one Python process. It's safe to pick one and switch later.
3. Edit the environment section of compose.yml. See the Configuration section below.

It's highly recommended configuring SSL next. Use nginx or preferred solution.

### Recommended nginx and SSL solution

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

#### Apache2 Alternative

- Install mods header, proxy, proxy_http (`a2enmod`)
- Setup the proxy part in the vhost

```
        ProxyPreserveHost On
        ProxyPass / http://localhost:8000/
        ProxyPassReverse / http://localhost:8000/
        RequestHeader set "X-Forwarded-Proto" expr=%{REQUEST_SCHEME}
        RequestHeader set "X-Forwarded-SSL" expr=%{HTTPS}
```

### Upgrading

1. Pull latest docker image `docker compose pull`
1. Restart `docker compose stop` and `docker compose up -d`

Database migrations will automatically happen.

## PikaPods

<a href="https://www.pikapods.com/pods?run=glitchtip">
<img src="https://www.pikapods.com/static/run-button.svg" alt="Run on PikaPods" style="width:200px;"/>
</a>

PikaPods is an affordable and managed hosting provider aimed at running open source applications.

Sign up and run GlitchTip on PikaPods [here](https://www.pikapods.com/pods?run=glitchtip). Set the required environment variables including `EMAIL_URL`. If you don't need email, you may set it to `consolemail://` and email will output to logs. See configuration [docs](https://glitchtip.com/documentation/install#configuration).

## Elestio

<a href="https://elest.io/open-source/glitchtip">
<img src="https://elest.io/images/logos/deploy-to-elestio-btn.png" alt="Run on Elestio" style="width:200px;"/>
</a>

Elestio is a managed hosting provider that supports multiple cloud providers, many worldwide regions, and on-premise. Elestio comes with email server support out of box, making it easier to configure.

Sign up and run GlitchTip on Elestio [here](https://elest.io/open-source/glitchtip). They have detailed documentation about [running GlitchTip](https://elest.io/open-source/glitchtip/resources/installation-guide). Consider adding a volume if you plan to store many events. After setting it up, go to the service URL, login, and create an organization.

Elestio, by default, will configure and upgrade GlitchTip for you. Larger or complex instances may benefit from adjusting the configuration via environment variables. To edit these, go to your GlitchTip service, Overview, Software, Update config. The syntax is the same as Docker Compose.

See configuration [docs](https://glitchtip.com/documentation/install#configuration).

## Nodion

<a href="https://www.nodion.com/en/deploy/glitchtip/">
<img src="https://nodion-static.nodioncdn.com/nodion-button-m.svg" alt="Run on Nodion" style="width:200px;"/>
</a>

Nodion is a managed hosting provider that offers easy deployment and management of open source applications with automated backups and monitoring.

Sign up and run GlitchTip on Nodion [here](https://www.nodion.com/en/deploy/glitchtip/).

Nodion allows adjusting many environment variables for configuration. See configuration [docs](https://glitchtip.com/documentation/install#configuration).

## Railway

<a href="https://railway.com/new/template/glitchtip?utm_medium=integration&utm_source=button&utm_campaign=glitchtip">
<img src="https://railway.com/button.svg" alt="Deploy on Railway" style="width:200px;"/>
</a>

Railway is a modern app hosting platform that makes it easy to deploy GlitchTip. The template deploys GlitchTip in all-in-one mode with PostgreSQL and Redis, and is ready to use immediately — no manual environment variable setup required.

Sign up and deploy GlitchTip on Railway [here](https://railway.com/new/template/glitchtip?utm_medium=integration&utm_source=button&utm_campaign=glitchtip). After deployment, configure email and other optional settings via environment variables. See [Configuration](https://glitchtip.com/documentation/install#configuration).

Railway supports S3-compatible object storage ("buckets") for file uploads such as sourcemaps. Services can be scaled both vertically and horizontally.

### Upgrading on Railway

The template uses a major version Docker image tag, which receives all minor updates automatically. Minor updates are safe and non-breaking. Major version upgrades happen roughly once a year and may include breaking changes such as dropping support for older PostgreSQL versions — check the [GlitchTip blog](https://glitchtip.com/blog) for release notes before upgrading the major version tag.

To update, click the update button in Railway for each service (GlitchTip, PostgreSQL, Redis). Railway also supports auto-updates, which can be enabled per service. Database migrations run automatically on startup.

## RepoCloud

<a href="https://repocloud.io/?ref=ek83qs8">
<img src="/assets/repocloud.png" alt="Deploy on RepoCloud" style="width:200px;"/>
</a>

RepoCloud provides a one-click deployment for open source applications, including GlitchTip.

Sign up and run GlitchTip on RepoCloud [here](https://repocloud.io/?ref=ek83qs8).

## Helm

Installing GlitchTip with Helm for Kubernetes is a good option for high throughput sites and users who are very comfortable using Kubernetes.

1. Add our Helm chart repo `helm repo add glitchtip https://gitlab.com/api/v4/projects/16325141/packages/helm/stable`
2. Review our [values.yaml](https://gitlab.com/glitchtip/glitchtip-helm-chart/-/blob/master/values.yaml) and [values.sample.yaml](https://gitlab.com/glitchtip/glitchtip-helm-chart/-/blob/master/values.sample.yaml). At a minimum, decide if using helm postgresql and set env.secret.SECRET_KEY
3. Install the chart `helm install glitchtip glitchtip/glitchtip -f your-values.yaml`. You'll need to specify your own values.yml file or make use of `--set`.

For postgresql, we recommend an externally managed database and providing only the `DATABASE_URL` environment variable. If using helm managed postgresql, then make sure to consider:

- If you uninstall the chart, it will not delete the pvc. If you reinstall the chart, it won't have the correct password because of this.
- postgresql helm chart does not support major upgrades (such as 14.0 to 15.0). It will fail to start. You could export to a sql file and import if downtime is acceptable. Minor updates are supported.

For high availability, production servers we recommend using multiple Kubernetes Nodes, an ingress and/or load balancer, a pod disruption budget, anti-affinity, and a managed PostgreSQL high availability database.

## Installing Without Docker

This method is not recommended and assumes the reader knows how to deploy Django, background task workers, SSL, and a web server. It requires manual upgrades.

1. `git clone` or download the latest Django backend [release tag](https://gitlab.com/glitchtip/glitchtip-backend/-/tags). Take note of the version number.
2. Download the latest frontend code at `wget https://gitlab.com/api/v4/projects/15449363/jobs/artifacts/<VERSION HERE>/download?job=build-assets -O assets.zip`. Replace the VERSION HERE with the same version from step 1. It must be exact, including the "v".
3. Extract the zip file and move the `dist/glitchtip-frontend` directory to the glitchtip-backend's dist folder. If you installed glitchtip to `/opt/glitchtip` then this might look like `unzip assets.zip; mv dist/glitchtip-frontend/browser /opt/glitchtip/dist`. Note the `mv` command will move the directory called "glitchtip-frontend".
4. Create a Python virtual environment (or other preferred way to run Python). Install [uv](https://docs.astral.sh/uv/) and run `uv sync` to install Python dependencies.
5. Set required [environment variables](https://glitchtip.com/documentation/install#configuration).
6. Migrate the database with `./manage.py migrate`
7. Collect static files `./manage.py collectstatic`
8. Configure the Django application with your favorite web server such as nginx or apache. Ensure SSL is configured. See `./bin/*` for run scripts to use or as examples.
9. Start the background worker with your preferred init system. For example systemd or supervisor. See `./bin/run-worker` for the worker command.

To upgrade, follow the same steps with the latest version tag. Include migrating the database and collectstatic.

# Configuration

Required environment variables:

- `SECRET_KEY` set to any random string
- Set up email:
- `EMAIL_URL`: SMTP string. It will look something like `"smtp://email:password@smtp_url:port"`. See format examples [here](https://django-environ.readthedocs.io/en/latest/tips.html#email-settings). Pay extra attention if the URL contains unsafe characters (eg. @ or /) and see how to handle them [in django-environ's documentation](https://django-environ.readthedocs.io/en/latest/tips.html#using-unsafe-characters-in-urls)
- Alternatively, use the Mailgun API by setting `MAILGUN_API_KEY`. Set `EMAIL_BACKEND` to `anymail.backends.mailgun.EmailBackend`. For more look [here](https://anymail.dev/en/stable/esps/mailgun/).
- Alternatively, use the SendGrid API by setting `SENDGRID_API_KEY`. Set `EMAIL_BACKEND` to `anymail.backends.sendgrid.EmailBackend`.
- GlitchTip supports additional email providers via [Anymail](https://anymail.dev): Postmark, Mailjet, Mandrill, SparkPost, Brevo, and Postal. Set the appropriate API key and `EMAIL_BACKEND`. See [Anymail documentation](https://anymail.dev/en/stable/) for details.
- `DEFAULT_FROM_EMAIL` Default from email address. Example `info@example.com`
- `GLITCHTIP_DOMAIN` Set to your domain. Include scheme (http or https). Example: `https://glitchtip.example.com`.

Optional environment variables:

- `I_PAID_FOR_GLITCHTIP` [Donate](https://liberapay.com/GlitchTip/donate), set this to "true", and some neat things will happen. This won't enable extra features but it will enable our team to continue building GlitchTip. We pay programmers, designers, illustrators, and free tier hosting on app.glitchtip.com without venture capital. We ask that all self-host users pitch in with a suggested donation of $5 per month per user. Prefer an invoice and support instead? Business users can also consider a paid support plan. Reach out to us at sales@glitchtip.com. Contributors on [Gitlab](https://gitlab.com/glitchtip) should also enable this.
- `GLITCHTIP_MAX_EVENT_LIFE_DAYS` (Default 90) Events and associated data older than this will be deleted.
- `GLITCHTIP_MAX_TRANSACTION_EVENT_LIFE_DAYS` (Default to max event life days) Transaction events older than this will be deleted.
- `GLITCHTIP_MAX_FILE_LIFE_DAYS` (Defaults to max event life days) Files older than this will be deleted. Files with any reference to a recent event are excluded. For example, a year old file that is used for an active release with event data, will not be deleted.
- `VALKEY_URL` Set valkey host explicitly. Example: `redis://:password@host:port/database`. You may also set them separately with `VALKEY_HOST`, `VALKEY_PORT`, `VALKEY_DATABASE`, and `VALKEY_PASSWORD`. For compability reasons, REDIS_* will also work. Set to empty string to disable VALKEY and utilize Postgres for task queue, cache, and session storage.
- `DATABASE_URL` Set PostgreSQL connect string. PostgreSQL 14 and above are supported.
- `CACHE_URL` use alternative cache backend for django, defaults to `VALKEY_URL`
- Content Security Policy (CSP) headers are enabled by default. In most cases there is no need to change these. However, you may add environment variables as documented in the [Django security documentation](https://docs.djangoproject.com/en/stable/ref/settings/#secure-csp) to modify them. GlitchTip supports setting these via environment variables using the `CSP_` prefix. For example, set `CSP_DEFAULT_SRC='self',scripts.example.com` to modify the default CSP header. Note the usage of comma separated values and single quotes on certain values such as 'self'.
- `ENABLE_USER_REGISTRATION` (Default True) When True, any user will be able to register through the self-signup. When False, user self-signup is disabled after the first user is registered. Subsequent users must use social apps if enabled or be created by a superuser on the backend and organization invitations may only be sent to existing users.
- `ENABLE_SOCIAL_APPS_USER_REGISTRATION` (Default `ENABLE_USER_REGISTRATION`) When True, any user will be able to register through social apps. When False, unregistered user login is disabled after the first user is registered. Subsequent users must use the self-signup or be created by a superuser on the backend.
- `ENABLE_ORGANIZATION_CREATION` (Default False) When False, only superusers will be able to create new organizations after the first. When True, any user can create a new organization.
- `GLITCHTIP_MAX_UPTIME_CHECK_LIFE_DAYS` (Default to max event life days) Uptime check data older than this will be deleted.
- `GLITCHTIP_ENABLE_UPTIME` (Default True) Set to False to disable uptime monitoring.
- `GLITCHTIP_ENABLE_MCP` (Default False) Enable the MCP (Model Context Protocol) server.
- `GLITCHTIP_INSTANCE_NAME` Custom instance name displayed in the UI. Supports markdown. Example: `"[My Company's](https://example.com) GlitchTip"`
- `ALLOWED_HOSTS` (Default `*`) Comma-separated list of allowed hostnames. Restrict this in production for added security.
- `CSRF_TRUSTED_ORIGINS` Comma-separated list of trusted origins for CSRF. Required when using a reverse proxy with a different domain.
- `BASE_PATH` Set when running GlitchTip under a subpath (e.g. `/glitchtip`).
- `PROXY_ENV` (Default False) Set to True to trust HTTP_PROXY, HTTPS_PROXY, and NO_PROXY environment variables.
- `LOG_LEVEL` (Default WARNING) Python log level. Set to `INFO` or `DEBUG` for troubleshooting.
- `ENABLE_OBSERVABILITY_API` (Default False) Enable Prometheus metrics endpoint.

### Server configuration

Scaling GlitchTip? Review these granian (web server) and django-vtasks (worker) environment variables.

- `VTASKS_CONCURRENCY` (Default 20) Number of concurrent asyncio background tasks to run.
- `DATABASE_POOL_MAX_SIZE` (Default 20) psycopg connection pool size, consider setting it the same as vtasks concurrency. Be aware of your postgres connection limit.
- `GRANIAN_WORKERS` (Default 1) Number of granian web workers to run. GlitchTip uses ASGI (async Python). Setting this higher is only recommended when not scaling horizontally. See more granian settings [here](https://github.com/emmett-framework/granian)

### Security headers

- `SECURE_HSTS_SECONDS` (Default 0) Set to a non-zero value (e.g. 31536000) to enable HTTP Strict Transport Security.
- `SECURE_HSTS_PRELOAD` (Default False)
- `SECURE_HSTS_INCLUDE_SUBDOMAINS` (Default False)

### All-in-One Mode

For small instances or trial setups, GlitchTip can run the web server, worker, and migrations in a single process. This significantly reduces memory usage, allowing GlitchTip to run on as little as 256MB of RAM.

To enable this, use the `./bin/run-all-in-one.sh` script, set the environment variable `SERVER_ROLE=all_in_one`, or set `GLITCHTIP_EMBED_WORKER=true`.

When using All-in-One mode:
- Background tasks are run within the web server process.
- Database migrations and partition maintenance are performed automatically on startup.
- It is recommended for instances with low traffic. For higher throughput, use separate web and worker services.

### Advanced settings for cache and tasks

By default, Valkey is used for the task queue, cache, and sessions. Valkey data is important to be available but is not necessarily worth backing up. When Valkey is disabled, Postgres will be used instead. Redis is also likely to work, but less tested.

- `SESSION_ENGINE` Controls where Django stores session data [See Django documentation](https://docs.djangoproject.com/en/4.0/ref/settings/#std-setting-SESSION_ENGINE).
- `SESSION_COOKIE_AGE` The age of session cookies, in seconds. Defaults to [Django default](https://docs.djangoproject.com/en/4.0/ref/settings/#std-setting-SESSION_COOKIE_AGE)

If using Sentinel, set `VALKEY_URL` with the sentinel protocol. Example: `sentinel://localhost:26379/mymaster/1`. The task queue (django-vtasks) reuses the cache connection, so no separate broker configuration is needed.

- `CACHE_SENTINEL_URL` Set to host:port of the sentinel instance(s). Comma-separated for multiple. Do not include the protocol nor password. For example `valkey:26379` or `sentinel1:26379,sentinel2:26379`.
- `CACHE_SENTINEL_PASSWORD` Set when using a password with Sentinel

Other cache backends may work but are not tested. Consider submitting a merge request to add support for your preferred solution.

### Advanced database permissions

A best practice is to assign the least privledged role needed to each GlitchTip service.

- web - Read and write access to rows.
- worker and migrate - Requires all permissions for the schema, including CREATE/DROP/ALTER table. It doesn't need to be a superuser or manage roles.
  Both services manage partitions, therefore they need to be the same role (owner of tables).

A simple example is to assign a single limited user to web.

```sql
CREATE ROLE glitchtip_app WITH LOGIN PASSWORD 'replace_with_app_password';
GRANT CONNECT ON DATABASE your_database_name TO glitchtip_app;
GRANT USAGE ON SCHEMA public TO glitchtip_app;

-- Grant read/write permissions on all EXISTING tables, sequences, and functions.
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO glitchtip_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO glitchtip_app;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO glitchtip_app;

-- Grant read/write permissions on all FUTURE tables, sequences, and functions.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
   GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO glitchtip_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
   GRANT USAGE, SELECT ON SEQUENCES TO glitchtip_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
   GRANT EXECUTE ON FUNCTIONS TO glitchtip_app;
```

Here's an example for the migrate/worker role.

```sql
CREATE ROLE glitchtip_maintainer WITH LOGIN PASSWORD 'replace_with_maintainer_password';
GRANT CONNECT ON DATABASE your_database_name TO glitchtip_maintainer;
GRANT CREATE, USAGE ON SCHEMA public TO glitchtip_maintainer;

-- Grant full permissions for all existing tables, sequences, and functions.
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO glitchtip_maintainer;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO glitchtip_maintainer;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO glitchtip_maintainer;

-- Grant full permissions for any new tables this role creates in the future.
ALTER DEFAULT PRIVILEGES FOR ROLE glitchtip_maintainer IN SCHEMA public
   GRANT ALL PRIVILEGES ON TABLES TO glitchtip_maintainer;
ALTER DEFAULT PRIVILEGES FOR ROLE glitchtip_maintainer IN SCHEMA public
   GRANT ALL PRIVILEGES ON SEQUENCES TO glitchtip_maintainer;
ALTER DEFAULT PRIVILEGES FOR ROLE glitchtip_maintainer IN SCHEMA public
   GRANT ALL PRIVILEGES ON FUNCTIONS TO glitchtip_maintainer;
```

### File storage

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

### Search Language

GlitchTip uses PostgreSQL full-text search. It will use the default PostgreSQL "text_search_config". In most cases there is no need to modify this. However, you may wish to change it as described [here](https://www.postgresql.org/docs/18/textsearch-configuration.html). This only affects search terms, it does not affect the site language. For example, if your preferred reading language is French and your code and user base uses English, you should pick English.

## Django Admin

Django Admin is not necessary for most users. However, if you'd like the ability to fully manage users beyond what our frontend offers, it may be useful. To enable, create a superuser via the Django command

`./manage.py createsuperuser`

Then go to `/admin/` and log in.

### Social Authentication (OAuth)

You may add Social Accounts in Django Admin at `/admin/socialaccount/socialapp/`. GlitchTip supports the following providers though django-allauth:

- [DigitalOcean](https://docs.allauth.org/en/latest/socialaccount/providers/digitalocean.html)
- [Gitea](https://docs.allauth.org/en/latest/socialaccount/providers/gitea.html)
- [Github](https://docs.allauth.org/en/latest/socialaccount/providers/github.html)
- [Gitlab](https://docs.allauth.org/en/latest/socialaccount/providers/gitlab.html)
- [Google](https://docs.allauth.org/en/latest/socialaccount/providers/google.html)
- [Microsoft](https://docs.allauth.org/en/latest/socialaccount/providers/microsoft.html)
- [NextCloud](https://docs.allauth.org/en/latest/socialaccount/providers/nextcloud.html)
- [Okta](https://docs.allauth.org/en/latest/socialaccount/providers/okta.html)
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
