#!/bin/bash
# 如果没有提供参数，则使用默认值
if [ $# -eq 0 ]; then
    serverName="master"
else
    serverName=$1
fi

serverpath="webStorage_"
serverpath+=$serverName

commit_hash=$(git rev-parse HEAD)
ssh webStorage "echo '$commit_hash' > ~/$serverpath/version"
echo "release $commit_hash"
sleep 3

# golang
bash ./go-build.sh
scp ./wod-go/main/build/webStorageserver webStorage:~/$serverpath/golangserver
echo "golang finish!"
sleep 3

# react
bash ./react-build.sh

cp config_backup.tsx $networkConfig
rm config_backup.tsx

scp -r ./wod-page/build webStorage:~/$serverpath/reactserver
