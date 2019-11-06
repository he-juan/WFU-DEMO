/* eslint-disable no-multiple-empty-lines */
export default {
  /* Preset settings */

  /* Camera control */

  /* Peripheral */
  dev_per_001: 'Hdmi 1 Out Resolution',
  dev_per_001_tip: 'Configures the output image resolution of HDMI 1. Greater resolution value means higher image definition. Please select the same resolution as the output display device. The device will automatically read the resolution supported by the output display device and compare it with the resolution supported by itself. Only the resolution supported by both will be used. The device will automatically obtain the optimal resolution when it boots up for the first time.',

  dev_per_002: 'Hdmi 2 Out Resolution',
  dev_per_002_tip: 'Configures the output image resolution of HDMI 2. Greater resolution value means higher image definition. Please select the same resolution as the output display device. The device will automatically read the resolution supported by the output display device and compare it with the resolution supported by itself. Only the resolution supported by both will be used. The device will automatically obtain the optimal resolution when it boots up for the first time.',

  dev_per_003: 'Enable Presentation Automatically When HDMI Plugged',
  dev_per_003_tip: 'If set to "Yes", then the device will display presentation automatically when HDMI is plugged in; If set to "No", a pop-up box will prompt the users to select "Ok" or "Cancel". If the users click neither "Ok" nor "Cancel", then the device will display presentation automatically after 30s timeout. The default setting is "No".',

  dev_per_004: 'Move Speed',
  dev_per_004_tip: 'Specifies the moving speed and zoom speed for the camera. "1" is slowest and "16" is fastest. The default setting is "1".',

  dev_per_005: 'Initial Position',
  dev_per_005_tip: 'Specifies the initial position of the camera when the device is powered up.Default: The camera moves to it\'s default position after bootup.Preset 1: The camera moves to the preset 1 after bootup. Preset 1 must be set up before reboot.Latest Position: After bootup, the camera moves to the latest position before reboot. The default setting is Default.',

  /* Remote control */
  dev_rc_001: 'Disable Remote Control App Connect',
  dev_rc_001_tip: 'If set to "Yes", the Remote Control App can be paired to the device via Bluetooth, but it cannot connect to the device to perform any operations. The default setting is "No".',

  dev_999: ''
}
