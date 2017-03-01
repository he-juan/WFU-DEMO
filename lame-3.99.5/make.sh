$CC $CFLAGS -shared  .libs/VbrTag.o .libs/bitstream.o
.libs/encoder.o .libs/fft.o .libs/gain_analysis.o .libs/id3tag.o
.libs/lame.o .libs/newmdct.o .libs/presets.o .libs/psymodel.o
.libs/quantize.o .libs/quantize_pvt.o .libs/reservoir.o
.libs/set_get.o .libs/tables.o .libs/takehiro.o .libs/util.o
.libs/vbrquantize.o .libs/version.o .libs/mpglib_interface.o
-Wl,--whole-archive ../libmp3lame/vector/.libs/liblamevectorroutines.a
../mpglib/.libs/libmpgdecoder.a -Wl,--no-whole-archive  -lm
-Wl,-soname -Wl,libmp3lame.so.0 -o .libs/libmp3lame.so.0.0.0
