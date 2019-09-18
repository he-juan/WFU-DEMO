sudo make clean && sudo make distclean
#source  envlighttpdarmEABI.sh
source  envlighttpdarm64.sh
./configure --host=aarch64-linux-android --with-websocket --without-bzip2 --without-zlib --prefix=/system/lighttpd --with-openssl
make && sudo make install
