#!/bin/sh
#
docker build -t microsvcruntime:v1 -f Dockerfile . --build-arg WmJDBCAdapter=$1 --build-arg WmCloudStreamsAnalytics=$2
