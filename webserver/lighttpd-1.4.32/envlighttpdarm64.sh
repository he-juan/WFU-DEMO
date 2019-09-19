export ARCH=arm64
export ANDROID_ROOT=${PWD}/../../../../../../android/
export OPTPATH=${ANDROID_ROOT}/prebuilts/gcc/linux-x86/aarch64/aarch64-linux-android-4.9/bin
export COMPILER=aarch64-linux-android-gcc
export CC=${OPTPATH}/aarch64-linux-android-gcc
export CXX=${OPTPATH}/aarch64-linux-android-g++
export LD=${OPTPATH}/aarch64-linux-android-ld

export PATH=$OPTPATH:$PATH
export CROSS_COMPILE=1 
export ARCH=arm64

export CFLAGS="--sysroot=${ANDROID_ROOT}/prebuilts/ndk/current/platforms/android-23/arch-arm64/ \
    -DHAVE_PCRE_H=1 -DBUILD_ON_ARM -DHAVE_LIBSSL -DHAVE_LIBPCRE=1 \
    -I${ANDROID_ROOT}/vendor/grandstream/external/openssl/include \
    -I${ANDROID_ROOT}/external/libxml2/include \
    -I${ANDROID_ROOT}/vendor/grandstream/external/dbus \
    -I${ANDROID_ROOT}/external/sqlite/dist \
    -I${ANDROID_ROOT}/external/zlib \
    -I${ANDROID_ROOT}/external/icu/icu4c/source/common/ \
    -I${ANDROID_ROOT}/external/bzip2 \
    -I${ANDROID_ROOT}/vendor/grandstream/tools/updatetools/prov_dwnld/include \
    -I${ANDROID_ROOT}/bionic/libc/include \
    -I${ANDROID_ROOT}/bionic/libm/include \
    -I${ANDROID_ROOT}/bionic/libc/kernel/uapi \
    -I${ANDROID_ROOT}/bionic/libc/kernel/android/uapi \
    -I${ANDROID_ROOT}/bionic/libc/kernel/uapi/asm-arm64 \
    -I${ANDROID_ROOT}/vendor/grandstream/external/pcre \
    -I${ANDROID_ROOT}/system/core/include  \
    -fPIE -fstack-protector-all -D_FORTIFY_SOURCE=1"

export LDFLAGS="-nostdlib -Bdynamic -pie -fPIE -Wl,-rpath-link=${ANDROID_ROOT}/out/target/product/gvc3220/system/lib64/ \
    -Wl,-z,now -Wl,-z,relro -Wl,-Bstatic -lssl_static2 -lcrypto_static2 -Wl,-Bdynamic \
    -L${ANDROID_ROOT}/out/target/product/gvc3220/system/lib64/  \
    -L${ANDROID_ROOT}/out/target/product/gvc3220/obj/STATIC_LIBRARIES/libssl_static2_intermediates/ \
    -L${ANDROID_ROOT}/out/target/product/gvc3220/obj/STATIC_LIBRARIES/libcrypto_static2_intermediates/"


export LIBS="-lc -ldl -lm -lgsnvram -lgsdbus -llog -licuuc -lpcre -lsqlite -lxml2 -lcutils"
