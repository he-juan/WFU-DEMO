#./bootstrap

# reconf
autoreconf --force --install --verbose
sudo ./configure --with-lighttpd=../../lighttpd-1.4.32
sudo make install

