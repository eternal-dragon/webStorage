#!/bin/bash
 
GOOS=linux GOARCH=amd64 go build -o build/webStorageServer -C server/main 

