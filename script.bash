#!/bin/bash

apt update -y
apt install -y nodejs npm git

mkdir -p /app
cd /app

git clone https://github.com/nk1044/CSL7510_assignment2.git .

cd application

npm install

nohup npm start > output.log 2>&1 &