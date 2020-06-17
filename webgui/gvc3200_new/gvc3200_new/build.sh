#!/bin/bash
build_path=`pwd`
if ! [ -x "$(command -v node)" ]; then
  echo '检测到node/npm还未安装, 请先安装node/npm后再执行自动编译'
  exit 1
fi

npm install --unsafe-perm --registry=http://192.168.120.239:8080

npm run build
