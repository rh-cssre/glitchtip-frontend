## Deploy Glitchtip on local Kubernetes.

## Installations:
- Install [kind](https://kind.sigs.k8s.io/)/[minikube](https://minikube.sigs.k8s.io/docs/start/)
- Install [helm](https://helm.sh/)

## Deployment:
- [Deploy Postgres](https://bitnami.com/stack/postgresql/helm) via Helm Charts
- [Deploy Redis](https://bitnami.com/stack/redis/helm) via Helm Charts
- Note the Credentials, and create the Corresponding Secrets
- List the Installed Charts: `helm list`
- Create/[Update](k8s.yaml) `glitchtip-rds` secret with credentials from `helm get notes postgres`
- Create/[Update](k8s.yaml) `glitchtip-elasticache` secret with credentials from `helm get notes elasticache`
- Similarly create/update Cron Job Secrets, A admin account with defined creds will be created. \
    Default creds: username: `admin`, pass: `admin-admin`, email: `admin@admin.com`

Finally Deploy all with: `kubectl apply -f k8s.yaml`

## Check the Pods
`kubectl get pods`

## Run
`kubectl port-forward {my-web-pod-123av} {local_port}:8000`