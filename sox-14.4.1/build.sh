# 默认安装路径:/system/sox/
# 安装前请先确认已安装libmad和lame(用于支持mp3)，2200源码下已包含这两个动态库以及头文件，可以直接安装
# 若不需要mp3支持，请修改env.sh，删除-lmad和-lmp3lame库链接

sudo make clean
source env.sh
./configure --host=arm-linux -disable-gomp --enable-shared --prefix=/system/sox/
make -s
sudo make install
