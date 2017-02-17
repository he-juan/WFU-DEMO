export ANDROID_ROOT=${PWD}/../../../../../../android/
export OPTPATH=${ANDROID_ROOT}/prebuilts/gcc/linux-x86/x86/x86_64-linux-android-4.9/bin
export COMPILER=x86_64-linux-android-gcc
export CC=${OPTPATH}/x86_64-linux-android-gcc
export CXX=${OPTPATH}/x86_64-linux-android-g++
export LD=${OPTPATH}/x86_64-linux-android-ld

export PATH=$OPTPATH:$PATH
export CROSS_COMPILE=1 
export ARCH=arm

export CFLAGS="-pie -fPIE\
    -DHAVE_PCRE_H=1 -DBUILD_ON_ARM -DHAVE_LIBPCRE=1 -DHAVE_LOCALTIME_R=1 -DHAVE_MMAP=1 -m32\
    -I${ANDROID_ROOT}/vendor/intel/external/openssl/include \
    -I${ANDROID_ROOT}/external/libxml2/include \
    -I${ANDROID_ROOT}/external/dbus \
    -I${ANDROID_ROOT}/vendor/grandstream/external/dbus \
	-I${ANDROID_ROOT}/vendor/grandstream/tools/updatetools/prov_dwnld/include \
    -I${ANDROID_ROOT}/external/sqlite/dist \
    -I${ANDROID_ROOT}/external/zlib \
    -I${ANDROID_ROOT}/external/icu/icu4c/source/common \
    -I${ANDROID_ROOT}/external/bzip2 \
    -I${ANDROID_ROOT}/bionic/libm/include \
    -I${ANDROID_ROOT}/prebuilts/ndk/9/platforms/android-18/arch-x86/usr/include \
    -I${ANDROID_ROOT}/external/pcre"

export LDFLAGS="-nostdlib -pie -fPIE -m32 --sysroot=${ANDROID_ROOT}/prebuilts/ndk/9/platforms/android-18/arch-x86\
    -Bdynamic -Wl,-dynamic-linker,/system/bin/linker \
    -Wl,-rpath-link=${ANDROID_ROOT}development/ndk/platforms/android-9/arch-x86/lib \
    -L${ANDROID_ROOT}/out/target/product/cht_gvc3210/obj/lib \
    -L${ANDROID_ROOT}/out/target/product/cht_gvc3210/obj/lib \
    -L${ANDROID_ROOT}/out/target/product/cht_gvc3210/system/lib \
    -L${ANDROID_ROOT}/prebuilts/gcc/linux-x86/x86/x86_64-linux-android-4.9/lib/gcc/x86_64-linux-android/4.8 \
    -L${ANDROID_ROOT}/prebuilts/ndk/9/platforms/android-18/arch-x86/usr/lib "

export LIBS="-lc -ldl -lm -lssl2 -lcrypto2 -lnvram -ldbus -llog -licuuc -lpcre -lsqlite -lwebupdate -lttycommon -ltimezone_offset \
    ${ANDROID_ROOT}/out/target/product/cht_gvc3210/obj/STATIC_LIBRARIES/libxml2_intermediates/libxml2.a"
