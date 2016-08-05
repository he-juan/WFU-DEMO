#go to ../websocket/modwebsocket ,exec make.sh first

sudo make clean && sudo make distclean
source  envlighttpdarmEABI.sh
./configure --host=arm-linux --with-websocket --with-pcre --without-bzip2 --without-zlib --prefix=/system/lighttpd --with-openssl
make && sudo make install
