/**
 * 通话设置下的词条
 */
export default {
  call_001: 'Local RTP port',
  call_001_tip: 'This parameter defines the local RTP-RTCP port pair used to listen and transmit. It is the base RTP port for channel 0. When configured, for audio, channel 0 will use this port_value for RTP and the port_value+1 for its RTCP; channel 1 will use port_value+10 for RTP and port_value+11 for its RTCP. For video, channel 0 will use port_value+2 for RTP and port_value+3 for its RTCP; channel 1 will use port_value+12 for RTP and port_value+13 for RTCP. The default value is 5004.',

  call_002: 'Use random port',
  call_002_tip: 'When set to "Yes", this parameter will force random generation of both the local SIP and RTP ports. This is usually necessary when multiple phones are behind the same full cone NAT. The Default setting is "No". (This parameter must be set to "No" for Direct IP Calling to work)',

  call_003: 'Keep-alive interval (s)',
  call_003_tip: 'Specifies how often the device sends a blank UDP packet to the SIP server in order to keep the "ping hole" on the NAT router to open. The default setting is 20 seconds.',

  call_004: 'STUN/TURN server',
  call_004_tip: 'The IP address or the Domain name of the STUN/TURN server. STUN resolution results are displayed in the STATUS page of the device Web GUI. Only non-symmetric NAT routers work with STUN.',

  call_005: 'TURN server username',
  call_005_tip: 'Fill in the username to validate TURN server.',

  call_006: 'TURN server password',
  call_006_tip: 'Fill in the password to validate TURN server.',

  call_007: 'Use NAT IP',
  call_007_tip: 'The NAT IP address in SIP/SDP messages. This field is blank by default settings. You should ONLY use it when required by your ITSP.',

  call_008: 'Disable call-waiting tone',
  call_008_tip: 'Disables the call waiting tone when call waiting is on. The default setting is "No".',

  call_009: 'Disable DND reminder ring',
  call_009_tip: 'Disables the DND reminder ring. If set to "Yes", the ring splash that indicates an incoming call when DND is enabled will not be played. The default setting is "No".',

  call_010: 'Auto mute on entry',
  call_010_tip: 'Configures whether to mute the call on entry automatically. If set to "Disable", then do not use auto mute function; If set to "Auto Mute on Outgoing Call", then mute automatically when the other party answers the outgoing call; If set to "Auto Mute on Incoming Call", then mute automatically when answers the incoming call; If set to "Mute on Incoming & Outgoing Call", then mute automatically when the call gets through.Note: this function only take effect when the phone is from the idle status to call status. Users could click the Mute button on call interface to cancel the current mute status. The default setting is "Disable".',

  call_011: 'Escape "#" as %23 in SIP URI',
  call_011_tip: 'Replaces “#” by “%23” for some special situations. The default setting is "Yes".',

  call_012: 'Disable in-call DTMF display',
  call_012_tip: 'Disable DTMF display when in-call.',

  call_013: 'Filter characters',
  call_013_tip: 'Set the characters to filter when dialing out numbers. Users could set up multiple characters. For example, if set to "[()-]", when dialing (0571)-8800-8888, the character "()-" will be automatically filtered and the device will dial 057188008888 directly instead. Note: this function doesn’t work on the local call page of the device.',

  call_014: 'Disable call-waiting',
  call_014_tip: 'Disables the call waiting feature. The default setting is "No".',

  call_015: 'Disable direct IP call',
  call_015_tip: 'Disables Direct IP Call. The default setting is "No".',

  call_016: 'Site name',
  call_016_tip: 'Specifies the site name to be imposed on the video of local video. When joining a multipoint conference, this site name is displayed in other participants\'video.<br />The default value is null.<br />Do not use any special characters in this site name, such as a colon (:), comma (,), hyphen (-), or underline (_).',

  call_017: 'Background transparency',
  call_017_tip: 'Specifies thebackground transparency for the site name display. The default value is Opaque.',

  call_018: 'Display position',
  call_018_tip: 'Specifies the site name\'s position on the video.The default value is Upper left corner.',

  call_019: 'Display duration',
  call_019_tip: 'Specifies the duration to display the site name. The default value is Always display.',

  call_020: 'Font color',
  call_020_tip: 'Specifies the color in which the site name is displayed. The default color is white.',

  call_021: 'Font size',
  call_021_tip: 'Specifies the font size for the site name display. The default value is Medium.',

  call_022: 'Bold',
  call_022_tip: 'Specifies whether the site name is displayed in bold. The default value is No.',

  call_023: 'Horizontal offset',
  call_023_tip: 'Fine-tunes the site name\'s position left or right on the local video. <br />Value range: 0%-96%. The default value is 0%.',

  call_024: 'Vertical offset',
  call_024_tip: 'Fine-tunes the site name\'s position up or down on the local video.<br />Value range: 0%-96%. The default value is 0%.',

  call_025: 'Echo delay',
  call_025_tip: 'Configures the device\'s HDMI audio delay to match the audio latency of different TV sets.',

  call_026: 'Ringtone volume',
  call_026_tip: 'Configures the volume of ringtone.',

  call_027: 'Media volume',
  call_027_tip: 'Configures the volume of media.',

  call_028: 'Device ringtone',
  call_028_tip: 'Configures device ringtone.',

  call_029: 'Notification ringtone',
  call_029_tip: 'Configures notification ringtone.',

  call_030: 'Audio device',
  call_030_tip: 'This option defines input and output devices for voice in call or media voice, including Auto, Bluetooth, USB, HDMI. and Built-in speaker. If select "USB", the voice input and output come from the USB device; If select "Bluetooth", the voice input and output come from the Bluetooth; If select "HDMI", the voice input comes from the built-in Mic in GVC while the output comes from HDMI; If select "Built-in speaker", the voice input comes from the built-in Mic in GVC while the output comes from Built-in speaker; If select "Gooseneck mic" and the output device is HDMI, the voice input comes from USB devices while the output comes from HDMI; If select "Auto", the device will automatically detect whether being connected to the USB, Bluetooth or HDMI, if connected to two or three of the above, the priority order of voice input and output is Bluetooth, USB, HDMI. The default settings is "Auto".',

  call_031: 'Ring back tone',
  call_031_tip: 'Configures tone frequencies based on parameters from the local telecom provider. By default, they are set to the North American standard. Frequencies should be configured with known values to avoid uncomfortable high pitch sounds.<br />Syntax: f1=val,f2=val [,c=on1/off1[-on2/off2[-on3/off3]]];(Frequencies are in Hz and cadence on and off are in 10ms)ON is the period of ringing (“On time” in ‘ms’) while OFF is the period of silence. In order to set a continuous ring, OFF should be zero. Otherwise it will ring ON ms and a pause of OFF ms and then repeat the pattern. Up to three cadences are supported.',

  call_032: 'Busy tone',
  call_032_tip: 'Configures tone frequencies based on parameters from the local telecom provider. By default, they are set to the North American standard. Frequencies should be configured with known values to avoid uncomfortable high pitch sounds.<br />Syntax: f1=val,f2=val [,c=on1/off1[-on2/off2[-on3/off3]]];(Frequencies are in Hz and cadence on and off are in 10ms)ON is the period of ringing (“On time” in ‘ms’) while OFF is the period of silence. In order to set a continuous ring, OFF should be zero. Otherwise it will ring ON ms and a pause of OFF ms and then repeat the pattern. Up to three cadences are supported.',

  call_033: 'Reorder tone',
  call_033_tip: 'Configures tone frequencies based on parameters from the local telecom provider. By default, they are set to the North American standard. Frequencies should be configured with known values to avoid uncomfortable high pitch sounds.<br />Syntax: f1=val,f2=val [,c=on1/off1[-on2/off2[-on3/off3]]];(Frequencies are in Hz and cadence on and off are in 10ms)ON is the period of ringing (“On time” in ‘ms’) while OFF is the period of silence. In order to set a continuous ring, OFF should be zero. Otherwise it will ring ON ms and a pause of OFF ms and then repeat the pattern. Up to three cadences are supported.',

  call_034: 'Confirmation tone',
  call_034_tip: 'Configures tone frequencies based on parameters from the local telecom provider. By default, they are set to the North American standard. Frequencies should be configured with known values to avoid uncomfortable high pitch sounds.<br />Syntax: f1=val,f2=val [,c=on1/off1[-on2/off2[-on3/off3]]];(Frequencies are in Hz and cadence on and off are in 10ms)ON is the period of ringing (“On time” in ‘ms’) while OFF is the period of silence. In order to set a continuous ring, OFF should be zero. Otherwise it will ring ON ms and a pause of OFF ms and then repeat the pattern. Up to three cadences are supported.',

  call_035: 'Ring cadence',
  call_035_tip: 'Configures the default ring cadence for the ring back tone. The default setting is c=2000/4000.',

  call_036: 'Start video automatically',
  call_036_tip: 'Defines whether to enable video automatically when there is an incoming call or a call from the contacts. If set to "Yes", the video will be started automatically in the above cases. If set to "No", answer or dial the call via SIP audio.',

  call_037: 'Video display mode',
  call_037_tip: 'Set the video display mode to "Original proportion", "Equal proportional cutting" or "Proportional add black edge". If set to "Original proportion", the device displays video in its original proportion that received from remote party, if the remote video display proportion is different from the device, the device will stretch or compress video to display it; If set to "Equal proportional cutting", the device will cut video to meet its own display proportion; If set to "Proportional add black edge", the device will display video in its original proportion, if still exists spare space, the device will add black edge on it. The default setting is "Equal proportional cutting".',

  call_038: 'Enable frame skipping in video decoder',
  call_038_tip: 'If set to default setting "Yes", the device will skip the P frame in lost video packet to decode the I frame in the next video packet. This setting helps to reduce video distortion. The default setting is "No".',

  call_039: 'AEC Level',
  call_039_tip: 'When selecting the audio device to gooseneck mode, it can be set up audio echo from 1 to 5 grades, adjust audio effects when the voice of the GVC equipment and equipment such as TV set size, the different distance of gooseneck  sound source and GVC equipment, at the same time “off” by default.'
}