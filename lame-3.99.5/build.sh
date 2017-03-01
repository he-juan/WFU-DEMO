sudo make clean
source env.sh
./configure --host=arm-linux --enable-static --prefix=/system/lame/
make
sudo make install
