#!/bin/bash
set -exv

BASE_IMG="glitchtip"
QUAY_IMAGE="quay.io/cs-sre/${BASE_IMG}"
IMG="${BASE_IMG}:latest"

GIT_HASH=`git rev-parse --short=7 HEAD`

prep() {
    yum -y update
    yum -y install git gcc-c++ bzip2 fontconfig initscripts
    yum -y install gtk2 libXtst libXScrnSaver libXScrnSaver-devel GConf2
    yum -y install Xvfb libXfont libsecret
    yum -y install wget
    sleep 3;
    curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
    yum -y install nodejs
}

install_dependencies() {
    # Build fabric8-analytics-vscode-extension
    npm install .
    npm ci

    if [ $? -eq 0 ]; then
        echo 'CICO: npm install : OK'
    else
        echo 'CICO: npm install : FAIL'
        exit 1
    fi
}

build_and_push(){
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
}

prep
install_dependencies
build_and_push
