export ANDROID_ROOT=${PWD}/../../../../../android/
export OPTPATH=${ANDROID_ROOT}/prebuilts/gcc/linux-x86/x86/x86_64-linux-android-4.9/bin
export COMPILER=x86_64-linux-android-gcc
export CC=${OPTPATH}/x86_64-linux-android-gcc
export CXX=${OPTPATH}/x86_64-linux-android-g++
export LD=${OPTPATH}/x86_64-linux-android-ld

export PATH=$OPTPATH:$PATH
export CROSS_COMPILE=1 
export ARCH=arm

export CFLAGS=" -pie -fPIE\
                -DHAVE_PCRE_H=1 -DBUILD_ON_ARM -DHAVE_LIBPCRE=1 -DHAVE_LOCALTIME_R=1 -DHAVE_MMAP=1 -m32 \
                --sysroot=${ANDROID_ROOT}/prebuilts/ndk/9/platforms/android-18/arch-x86 \
                -I${ANDROID_ROOT}/frameworks/base/include \
                -I${ANDROID_ROOT}/prebuilts/ndk/9/platforms/android-18/arch-x86/usr/include \
                -I${PWD}/../lame-3.99.5/include/ \
                -I${PWD}/../libmad-0.15.1b/ "

export LDFLAGS="-nostdlib -pie -fPIE -m32 --sysroot=${ANDROID_ROOT}/prebuilts/ndk/9/platforms/android-18/arch-x86 \
                -Bdynamic -Wl,-dynamic-linker,/system/bin/linker \
                -Wall -W -Wshadow -pedantic -std=gnu99 -export-dynamic -lc \
                -Wl,-rpath-link=${ANDROID_ROOT}development/ndk/platforms/android-9/arch-x86/lib \
                -L${ANDROID_ROOT}/prebuilts/gcc/linux-x86/x86/x86_64-linux-android-4.9/lib/gcc/x86_64-linux-android/4.8 \
                -L${ANDROID_ROOT}/prebuilts/ndk/9/platforms/android-18/arch-x86/usr/lib \
                -L${PWD}/../sox/lib/lame/lib/ \
                -L${PWD}/../sox/lib/libmad/lib/"

export LIBS="-lmp3lame -lmad"

#export LDFLAGS="-L${ANDROID_ROOT}/out/target/product/wing-k70/obj/lib -L${ANDROID_ROOT}/out/target/product/evb96/system/lib/"
