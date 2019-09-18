#./bootstrap

# reconf
#complie tcpserver.c
source ../lighttpd-1.4.32/envlighttpdarm64.sh
$CC $CFLAGS $LDFLAGS $LIBS tcpserver.c  -o tcpserver crtbegin_dynamic.o crtend_android.o 


