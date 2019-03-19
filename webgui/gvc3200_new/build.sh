#!/bin/bash
build_path=`pwd`
if ! [ -x "$(command -v node)" ]; then
  echo '检测到node尚未安装。正在试图从网络安装...所需时间与你的网络环境有关'
  cd /usr/local/etc
  path=`pwd`
  wget https://nodejs.org/dist/v10.9.0/node-v10.9.0-linux-x64.tar.xz -T 60 -t 2
  tar xf  node-v10.9.0-linux-x64.tar.xz 
  ln -s $path/node-v10.9.0-linux-x64/bin/npm   /usr/local/bin/npm
  ln -s $path/node-v10.9.0-linux-x64/bin/node   /usr/local/bin/node
  cd $build_path	 
fi
if ! [ -x "$(command -v node)" ]; then
  echo 'node自动安装失败,建议你手动安装好node环境后再启动本脚本' 
  exit 1
fi
if ! [ -x "$(command -v npm)" ]; then
  echo 'npm自动安装失败,建议你手动安装npm' 
  exit 1
fi

npm install --unsafe-perm=true --allow-root

npm run build

# 请使用root用户执行此脚本
