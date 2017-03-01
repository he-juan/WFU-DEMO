export ANDROID_ROOT=${PWD}/../../../../../android/
export OPTPATH=${ANDROID_ROOT}/prebuilts/gcc/linux-x86/x86/x86_64-linux-android-4.9/bin
export COMPILER=x86_64-linux-android-gcc
export CC=${OPTPATH}/x86_64-linux-android-gcc
export CXX=${OPTPATH}/x86_64-linux-android-g++
export LD=${OPTPATH}/x86_64-linux-android-ld

export PATH=$OPTPATH:$PATH
export CROSS_COMPILE=1 
export ARCH=arm

export CFLAGS="-pie -fPIE -m32 \
               --sysroot=${ANDROID_ROOT}/prebuilts/ndk/9/platforms/android-18/arch-x86/ \
               -I${ANDROID_ROOT}/prebuilts/ndk/9/platforms/android-18/arch-x86/usr/include"

export LDFLAGS="-pie -fPIE -m32 \
                -Bdynamic -Wl,-dynamic-linker,/system/bin/linker \
                -Wl,-rpath-link=${ANDROID_ROOT}development/ndk/platforms/android-9/arch-x86/lib \
                --sysroot=${ANDROID_ROOT}/prebuilts/ndk/9/platforms/android-18/arch-x86/ \
                -L${ANDROID_ROOT}/prebuilts/gcc/linux-x86/x86/x86_64-linux-android-4.9/lib/gcc/x86_64-linux-android/4.8 \
                -L${ANDROID_ROOT}/prebuilts/ndk/9/platforms/android-18/arch-x86/usr/lib \
                -L${ANDROID_ROOT}/out/target/product/cht_gvc3210/obj/lib \
                -L${ANDROID_ROOT}/out/target/product/cht_gvc3210/system/lib "
