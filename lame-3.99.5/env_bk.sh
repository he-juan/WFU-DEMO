export ARCH=arm
export ANDROID_ROOT=${PWD}/../../../../../android/
export OPTPATH=${ANDROID_ROOT}/prebuilts/gcc/linux-x86/x86/x86_64-linux-android-4.9/bin
export COMPILER=x86_64-linux-android-gcc
export CC=${OPTPATH}/x86_64-linux-android-gcc
export CXX=${OPTPATH}/x86_64-linux-android-g++
export LD=${OPTPATH}/x86_64-linux-android-ld

export PATH=$OPTPATH:$PATH
export CROSS_COMPILE=1 
export ARCH=arm

export CFLAGS=" -DANDROID -I${ANDROID_ROOT}/vendor/intel/external/openssl/include \
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
                -I${ANDROID_ROOT}/prebuilts/ndk/9/platforms/android-18/arch-x86/usr/include \
                -I${ANDROID_ROOT}/frameworks/base/include"

export LDFLAGS="-nostdlib -pie -fPIE -m32 --sysroot=${ANDROID_ROOT}/prebuilts/ndk/9/platforms/android-18/arch-x86 \
                -L${ANDROID_ROOT}/out/target/product/cht_gvc3210/obj/lib \
                -L${ANDROID_ROOT}/out/target/product/cht_gvc3210/system/lib \
                -L${ANDROID_ROOT}/prebuilts/gcc/linux-x86/x86/x86_64-linux-android-4.9/lib/gcc/x86_64-linux-android/4.8 \
                -L${ANDROID_ROOT}/prebuilts/ndk/9/platforms/android-18/arch-x86/usr/lib \
                -Wall -W -Wshadow -pedantic -std=gnu99 -export-dynamic -nostdlib -Bdynamic -Wl,-dynamic-linker,/system/bin/linker -lc"
