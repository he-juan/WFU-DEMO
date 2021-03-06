# Add by grandstream
# Function: for spec files
#

LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)

LOCAL_POST_PROCESS_COMMAND := $(shell mkdir -p $(TARGET_OUT)/lighttpd)
LOCAL_POST_PROCESS_COMMAND += $(shell cp -r $(LOCAL_PATH)/webserver/etc $(TARGET_OUT)/lighttpd/.)
LOCAL_POST_PROCESS_COMMAND += $(shell cp -r $(LOCAL_PATH)/webserver/lighttpd/sbin $(TARGET_OUT)/lighttpd/.)
LOCAL_POST_PROCESS_COMMAND += $(shell cp -r $(LOCAL_PATH)/webserver/lighttpd/lib $(TARGET_OUT)/lighttpd/.)
LOCAL_POST_PROCESS_COMMAND += $(shell mkdir -p $(TARGET_OUT)/webgui/gvc3200)
LOCAL_POST_PROCESS_COMMAND += $(shell cd $(LOCAL_PATH)/webgui/gvc3200_new/ && ./build.sh > /tmp/service_build_log)
LOCAL_POST_PROCESS_COMMAND += $(shell cp -r $(LOCAL_PATH)/webgui/gvc3200_new/build/* $(TARGET_OUT)/webgui/gvc3200/)
LOCAL_POST_PROCESS_COMMAND += $(shell cp -r $(LOCAL_PATH)/webserver/pem/gxe50xx.pem $(TARGET_OUT)/etc/.)

LOCAL_POST_PROCESS_COMMAND := $(shell mkdir -p $(TARGET_OUT)/lib)
LOCAL_POST_PROCESS_COMMAND += $(shell mkdir -p $(TARGET_OUT)/bin)
LOCAL_POST_PROCESS_COMMAND += $(shell cp -r $(LOCAL_PATH)/sox/bin/sox $(TARGET_OUT)/bin/.)
LOCAL_POST_PROCESS_COMMAND += $(shell cp -r $(LOCAL_PATH)/sox/lib/sox/lib/libsox.so* $(TARGET_OUT)/lib64/.)
#LOCAL_POST_PROCESS_COMMAND += $(shell cp -r $(LOCAL_PATH)/sox/lib/libmad/lib/libmad.so $(TARGET_OUT)/lib/.)
LOCAL_POST_PROCESS_COMMAND += $(shell cp -r $(LOCAL_PATH)/sox/lib/lame/lib/libmp3lame.so $(TARGET_OUT)/lib64/.)

#include $(BUILD_MULTI_PREBUILT)

include $(call all-makefiles-under,$(LOCAL_PATH))
