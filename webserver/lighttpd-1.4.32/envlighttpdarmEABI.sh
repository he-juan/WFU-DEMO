export ARCH=arm
export ANDROID_ROOT=${PWD}/../../../../../../android/
export OPTPATH=${ANDROID_ROOT}/prebuilts/gcc/linux-x86/arm/arm-linux-androideabi-4.7/bin
export COMPILER=arm-linux-androideabi-gcc
export CC=${OPTPATH}/arm-linux-androideabi-gcc
export CXX=${OPTPATH}/arm-linux-androideabi-g++
export LD=${OPTPATH}/arm-linux-androideabi-ld

export PATH=$OPTPATH:$PATH
export CROSS_COMPILE=1 
export ARCH=arm

export CFLAGS=" \
    -DHAVE_PCRE_H=1 -DBUILD_ON_ARM -DHAVE_LIBPCRE=1 -DHAVE_LOCALTIME_R=1 -DHAVE_MMAP=1 \
    -I${ANDROID_ROOT}/external/openssl/include/ \
    -I${ANDROID_ROOT}/external/libxml2/include \
    -I${ANDROID_ROOT}/external/dbus \
    -I${ANDROID_ROOT}/external/sqlite/dist \
    -I${ANDROID_ROOT}/external/zlib \
    -I${ANDROID_ROOT}/external/icu4c/common \
    -I${ANDROID_ROOT}/external/bzip2 \
    -I${ANDROID_ROOT}/bionic/libc/arch-arm/include \
    -I${ANDROID_ROOT}/bionic/libc/include \
    -I${ANDROID_ROOT}/bionic/libc/kernel/common \
    -I${ANDROID_ROOT}/bionic/libc/kernel/arch-arm \
    -I${ANDROID_ROOT}/bionic/libm/include \
    -I${ANDROID_ROOT}/prebuilts/ndk/9/platforms/android-18/arch-arm/usr/include \
    -I${ANDROID_ROOT}/vendor/grandstream/external/pcre"

export LDFLAGS=" -nostdlib \
    -Bdynamic -Wl,-dynamic-linker,/system/bin/linker \
    -Wl,-rpath-link=${ANDROID_ROOT}/out/target/product/mars-gvc3200/obj/lib \
    -L${ANDROID_ROOT}/out/target/product/mars-gvc3200/obj/lib \
    -L${ANDROID_ROOT}/out/target/product/mars-gvc3200/system/lib \
    -L${ANDROID_ROOT}/prebuilts/gcc/linux-x86/arm/arm-linux-androideabi-4.7/lib/gcc/arm-linux-androideabi/4.7 "


export LIBS="-lc -ldl -lm -lssl -lnvram -ldbus -llog -licuuc -lpcre -lsqlite -lwebupdate -lttycommon -ltimezone_offset\
     ${ANDROID_ROOT}/out/target/product/mars-gvc3200/obj/STATIC_LIBRARIES/libxml2_intermediates/libxml2.a"
