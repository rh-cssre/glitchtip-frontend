#!/bin/bash
set -exv

docker build . -f sre/Dockerfile.sre -t glitchtip

build_and_push(){

    docker login  -u="$QUAY_USER" -p="$QUAY_TOKEN" quay.io
    # push the image
    docker tag ${IMG} "${QUAY_IMAGE}:latest"
    docker push "${QUAY_IMAGE}:latest"

    docker tag ${IMG} "${QUAY_IMAGE}:${GIT_HASH}"
    docker push "${QUAY_IMAGE}:${GIT_HASH}"
}

build_and_push