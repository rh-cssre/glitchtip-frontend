#!/bin/bash
set -exv

# Environment variables
BASE_IMG="glitchtip"
QUAY_IMAGE="quay.io/cs-sre/${BASE_IMG}"
IMG="${BASE_IMG}:latest"
GIT_HASH=`{git rev-parse --short HEAD}`

# Build Image
docker build . -f sre/Dockerfile.sre -t ${IMG}

build_and_push(){

    docker login  -u="$QUAY_USER" -p="$QUAY_TOKEN" quay.io
    # push the image
    docker tag ${IMG} "${QUAY_IMAGE}:latest"
    docker push "${QUAY_IMAGE}:latest"

    docker tag ${IMG} "${QUAY_IMAGE}:${GIT_HASH}"
    docker push "${QUAY_IMAGE}:${GIT_HASH}"
}

build_and_push