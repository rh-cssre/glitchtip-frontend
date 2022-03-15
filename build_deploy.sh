#!/bin/bash
set -exv

BASE_IMG="glitchtip"
QUAY_IMAGE="quay.io/cs-sre/${BASE_IMG}"
IMG="${BASE_IMG}:latest"

GIT_HASH=`git rev-parse --short=7 HEAD`

# build the image
docker build  --no-cache \
              --force-rm \
              -t ${IMG}  \
              -f ./Dockerfile.prod .

docker login  -u="$QUAY_USER" -p="$QUAY_TOKEN" quay.io
# push the image
docker tag ${IMG} "${QUAY_IMAGE}:latest"
docker push "${QUAY_IMAGE}:latest"

docker tag ${IMG} "${QUAY_IMAGE}:${GIT_HASH}"
docker push "${QUAY_IMAGE}:${GIT_HASH}"