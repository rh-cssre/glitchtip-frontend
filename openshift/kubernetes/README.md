## Deploy Glitchtip on local Kubernetes.

## Installations:
- Install [kind](https://kind.sigs.k8s.io/)/[minikube](https://minikube.sigs.k8s.io/docs/start/)
- Install [helm](https://helm.sh/)

## Deployment:
- [Deploy Postgres](https://bitnami.com/stack/postgresql/helm) via Helm Charts
- [Deploy Redis](https://bitnami.com/stack/redis/helm) via Helm Charts
- Note the Credentials, and create the Corresponding Secrets
- List the Installed Charts: `helm list`
- Create `glitchtip-rds` secret with credentials from `helm get notes postgres`:
    > `kubectl create secret generic glitchtip-rds --from-literal=db.user=postgres --from-literal=db.name=postgres-postgresql --from-literal=db.password=${POSTGRES_PASSWORD} --from-literal=db.host=postgres-postgresql --from-literal=db.port=5432`  
- Create `glitchtip-elasticache` secret with credentials from `helm get notes redis`:
    > `kubectl create secret generic glitchtip-elasticache --from-literal=db.user=redis --from-literal=db.name=${NAME_OF_RELEASE} --from-literal=db.auth_token=${REDIS_PASSWORD} --from-literal=db.host=my-release-redis-master --from-literal=db.port=6379`  
- Create secret `redis-credentials`: 
    > `kubectl create secret generic redis-credentials --from-literal=redis.url={NAME-OF-REDIS}-master.default.svc.cluster.local`
- Create a Admin User Creds, A job will create a Admin account to enable signin in the application:
    > `kubectl create secret generic superuser-secret --from-literal=DJANGO_SUPERUSER_EMAIL=admin@admin.com --from-literal=DJANGO_SUPERUSER_PASSWORD={ANY-BASIC-PASSWORD-THAT-YOU-CAN-REMEMBER} --from-literal=DJANGO_SUPERUSER_USERNAME=admin`
- Create a Generic Secret:
    > `kubectl create secret generic glitchtip-secret --from-literal=PASSWORD_HASH_TOKEN="&9+w^zi1r(ii^4fgpw6t=9cdyy5flyv@y=j9vtr@0jj83o(8bd"`

Finally Deploy rest of the artifacts with: `kubectl apply -f k8s.yaml`

## Check the Pods
`kubectl get pods`

## Run
`kubectl port-forward {my-web-pod-123av} {local_port}:8000`