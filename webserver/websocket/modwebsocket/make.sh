#./bootstrap

# reconf
autoreconf --force --install --verbose
./configure --with-lighttpd=../../lighttpd-1.4.32
make install

