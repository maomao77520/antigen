#!/bin/bash

IMAGE="registry.cn-shenzhen.aliyuncs.com/ding-jie/dx-antigen-front"
IMAGE_INTERNAL="registry-vpc.cn-shenzhen.aliyuncs.com/ding-jie/dx-antigen-front"

BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

echo BASE_DIR=$BASE_DIR

PUSH="NO"
RUN="NO"
RUN_PORT="8081"


while getopts "prP:" opt; do
  case ${opt} in
    p )
      echo WILL push to aliyun image registry
      PUSH="YES"
      ;;
    r )
      echo WILL run locally
      RUN="YES"
      ;;
    P )
      echo WILL run locally in PORT $OPTARG
      RUN_PORT="$OPTARG"
      ;;
    : )
      echo "Invalid option: $OPTARG requires an argument" 1>&2
      ;;
  esac
done
shift $((OPTIND -1))

VERSION="$1"

if [ "$VERSION" == "" ]; then
    GIT_BRANCH="$(git branch|grep '*'|awk '{print $2}')"
    COMMIT_ID="$(git log --oneline|head -1|awk '{print $1}')"
    DATE="$(date +'%Y-%m-%d')"
    VERSION="$GIT_BRANCH-$DATE-$COMMIT_ID"

    echo VERSION was generated automatically: VERSION=$VERSION
fi

IMAGE_TAG=$IMAGE:$VERSION


docker build . -f $BASE_DIR/docker/Dockerfile -t $IMAGE_TAG

if [ "$PUSH" == "YES" ]; then
    echo pushing image to aliyun image registry...
    docker push $IMAGE_TAG

    echo IMAGE_TAG = $IMAGE_TAG
fi


echo 外网镜像地址： $IMAGE_TAG
echo 内网镜像地址： $IMAGE_INTERNAL:$VERSION

if [ "$RUN" == "YES" ]; then
    echo Running image locally...
    docker run -p $RUN_PORT:80 $IMAGE_TAG
fi

