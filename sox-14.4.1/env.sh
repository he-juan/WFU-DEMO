export ARCH=arm
export ANDROID_ROOT=${PWD}/../../../../../android/
export OPTPATH=${ANDROID_ROOT}/prebuilts/gcc/linux-x86/arm/arm-linux-androideabi-4.7/bin
export COMPILER=arm-linux-androideabi-gcc
export CC=${OPTPATH}/arm-linux-androideabi-gcc
export CXX=${OPTPATH}/arm-linux-androideabi-g++
export LD=${OPTPATH}/arm-linux-androideabi-ld

export PATH=$OPTPATH:$PATH
export CROSS_COMPILE=1 
export ARCH=arm

export CFLAGS=" -DANDROID -I${ANDROID_ROOT}/external/openssl/include \
                -I${ANDROID_ROOT}/external/libxml2/include -I${ANDROID_ROOT}/external/dbus \
                -I${ANDROID_ROOT}/external/zlib \
                -I${ANDROID_ROOT}/external/icu4c/common \
                -I${ANDROID_ROOT}/external/bzip2 \
                -I${ANDROID_ROOT}/external/stlport/stlport \
                -I${ANDROID_ROOT}/bionic/libc/arch-arm/include \
                -I${ANDROID_ROOT}/bionic/libc/include \
                -I${ANDROID_ROOT}/bionic/libstdc++/include \
                -I${ANDROID_ROOT}/bionic/libc/kernel/common \
                -I${ANDROID_ROOT}/bionic/libc/kernel/arch-arm \
                -I${ANDROID_ROOT}/bionic/libm/include \
                -I${ANDROID_ROOT}/frameworks/base/include \
                -I${PWD}/../sox/lib/lame/include/ \
                -I${PWD}/../sox/lib/libmad/include/"

export LDFLAGS="-L${ANDROID_ROOT}/out/target/product/wing-k70/obj/lib \
                -L${ANDROID_ROOT}/out/target/product/wing-k70/system/lib/ \
                -L${ANDROID_ROOT}/prebuilts/gcc/linux-x86/arm/arm-linux-androideabi-4.7/lib/gcc/arm-linux-androideabi/4.7 \
                -L${PWD}/../sox/lib/lame/lib \
                -L${PWD}../sox/lib/libmad/lib/ -Wall -W -Wshadow -pedantic -std=gnu99 -export-dynamic -nostdlib -Bdynamic -Wl,-dynamic-linker,/system/bin/linker -lc"

export LIBS="-lmp3lame -lmad"

#export LDFLAGS="-L${ANDROID_ROOT}/out/target/product/wing-k70/obj/lib -L${ANDROID_ROOT}/out/target/product/evb96/system/lib/"
