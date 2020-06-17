/**
 * 网络设置配置项词条以及tips
 */
export default {
  net_001: 'Preferred Internet Protocol',
  net_001_tip: 'Selects which Internet protocol to use. When both IPv4 and IPv6 are enabled, phone attempts to use preferred protocol first and switches to the other choice if it fails.',

  net_002: 'IPv4 Address Type',
  net_002_tip: 'Users could select "DHCP", "Static IP" or "PPPoE". <br />• DHCP: Obtain the IP address via one DHCP server in the LAN. ALL domain values about static IP/PPPoE are unavailable. (Although some domain values have been saved in the flash.)<br />• PPPoE: Configures PPPoE account/password. Obtain the IP address from the PPPoE server via dialing.<br />• Static IP: Manual configures IP Address, Subnet Mask, Default Router\'s IP Address, DNS Server 1, DNS Server 2.',

  net_003: 'DHCP VLAN Override',
  net_003_tip: 'Selects the DHCP Option VLAN mode. When setting to "DHCP Option 132 and DHCP option 133", the device will get DHCP option 132 and 133 as VLAN ID and VLAN priority. When setting to "Encapsulated in DHCP Option 43", the device will get values from Option 43 which has VLAN ID and VLAN priority encapsulated. Note: Please make sure the "Allow DHCP Option 43, 160 and 66 Override Server" setting under maintenance->upgrade is checked. The default setting is "Disable".',

  net_004: 'Host Name (option 12)',
  net_004_tip: 'Specifies the name of the client. This field is optional but may be required by some Internet Service Providers.',

  net_005: 'Vendor Class ID (option 60)',
  net_005_tip: 'Specifies the name of the client. This field is optional but may be required by some Internet Service Providers.',

  net_006: 'Layer 2 QoS 802.1Q/VLAN Tag (Ethernet)',
  net_006_tip: 'Assigns the VLAN Tag of the Layer 2 QoS packets for LAN port. The default value is 0. Note: Please do not change the setting before understanding the VLAN\'s settings. Otherwise, the device might not be able to get the correct IP address.',

  net_007: 'Layer 2 QoS 802.1p Priority Value (Ethernet)',
  net_007_tip: 'Assigns the priority value of the Layer 2 QoS packets. The Default value is 0.',

  net_008: 'IP Address',
  net_008_tip: 'Enter the IP address when static IP is used.',

  net_009: 'Subnet Mask',
  net_009_tip: 'Enter the Subnet Mask when static IP is used.',

  net_010: 'Gateway',
  net_010_tip: 'Enter the Default Gateway when static IP is used.',

  net_011: 'DNS Server 1',
  net_011_tip: 'Enter the DNS Server 1 when static IP is used.',

  net_012: 'DNS Server 2',
  net_012_tip: 'Enter the DNS Server 2 when static IP is used.',

  net_013: 'Layer 2 QoS 802.1Q/VLAN Tag (Ethernet) for VoIP Calls',

  net_014: 'Layer 2 QoS 802.1p Priority Value (Ethernet) for VoIP Calls',

  net_015: 'PPPoE Account ID',
  net_015_tip: 'Enter the PPPoE Account ID.',

  net_016: 'PPPoE Password',
  net_016_tip: 'Enter the PPPoE Password.',

  net_019: 'IPv6 Address',
  net_019_tip: 'The IPv6 address obtained on the device.',

  net_020: 'Preferred DNS Server',
  net_020_tip: 'Enter the Preferred DNS server.',

  net_021: 'Static IPv6 Address',
  net_021_tip: 'Enter the static IPv6 address in "Statically configured" IPv6 address type.',

  net_022: 'IPv6 Prefix Length',
  net_022_tip: 'Enter the IPv6 prefix length in "Statically configured" IPv6 address type.',

  net_025: '802.1X Mode',
  net_025_tip: 'Allows the user to enable/disable 802.1X mode on the device. Configures 802.1X authentication when connected to the switch. The default setting is "Disable".',

  net_026: '802.1X Identity',
  net_026_tip: 'Enter the Identity information for the 802.1X mode.',

  net_027: '802.1X Secret',
  net_027_tip: 'Enter the secret for the 802.1X mode.',

  net_028: 'CA Certificate',
  net_028_tip: 'Upload the CA Certificate for the 802.1X mode.',

  net_029: 'Client Certificate',
  net_029_tip: 'Upload the Client Certificate for the 802.1X mode.',

  net_030: 'Private Key',
  net_030_tip: 'Upload the Private Key for the 802.1X mode.',

  net_031: 'Wi-Fi Function',
  net_031_tip: 'This parameter enables/disables the Wi-Fi function. The default setting is set to "No".',

  net_032: 'ESSID',
  net_032_tip: 'This parameter sets the ESSID for the Wireless network. Press "Scan" to scan for the available wireless network. The number in brackets represents the signal intensity.',

  net_033: 'ESSID',
  net_033_tip: 'Enter the hidden ESSID name.',

  net_034: 'Security Mode For Hidden SSID',
  net_034_tip: 'This parameter defines the security mode used for the wireless network when the SSID is hidden.',

  net_035: 'Password',
  net_035_tip: 'Configures the hidden ESSID password.',

  net_036: 'Country Code',
  net_036_tip: 'Configure WiFi country code. The default value is "US".',

  net_037: 'Host Name (option 12)',
  net_037_tip: 'Specifies the name of the client. This field is optional but may be required by some Internet Service Providers.',

  net_038: 'Vendor Class ID (option 60)',
  net_038_tip: 'Used by clients and servers to exchange vendor class ID.',

  net_039: 'Enable OpenVPN®',
  net_039_tip: 'This enables/disables OpenVPN® functionality, and requires the user to have access to an OpenVPN® server. The default setting is No. NOTE: To use OpenVPN® functionalities, users must enable OpenVPN® and configure all of the settings related to OpenVPN®, including server address, port, OpenVPN® CA, certificate and key. Additionally, the user must also set the SIP account to use "VPN" for the "Nat Traversal" (under Account-> Network Settings).',

  net_040: 'OpenVPN® Mode',
  net_040_tip: 'Simple mode only supports some basic or common parameters configuration; Professional mode suppports configuration file upload, which is totally customized by need, please refer to https://openvpn.net for more information.',

  net_041: 'Upload OpenVPN® Configuration',
  net_041_tip: 'Upload configuration file to the device.',

  net_042: 'Enable OpenVPN® Comp-lzo',
  net_042_tip: 'Configures enable/disable the LZO compression. When the LZO Compression is enabled on the OpenVPN server, you must turn on it at the same time. Otherwise, the network will fail to connect.',

  net_043: 'OpenVPN® Server Address',
  net_043_tip: 'The URL/IP address for the OpenVPN® server.',

  net_044: 'OpenVPN® Port',
  net_044_tip: 'The network port for the OpenVPN® server. By default, it is set to 1194.',

  net_045: 'OpenVPN® Transport',
  net_045_tip: 'Determines network protocol used for OpenVPN®.',

  net_046: 'OpenVPN® CA',
  net_046_tip: 'OpenVPN® CA file (ca.crt) required by the OpenVPN® server for authentication purposes. Press "Upload" to upload the corresponding file to the device.',

  net_047: 'OpenVPN® Client Certificate',
  net_047_tip: 'OpenVPN® Client certificate file (*.crt) required by the OpenVPN® server for authentication purposes. Press "Upload" to upload the corresponding file to the device.',

  net_048: 'OpenVPN® Client Key',
  net_048_tip: 'The OpenVPN® Client key (*.key) required by the OpenVPN® server for authentication purposes. Press "Upload" to upload the corresponding file to the device.',

  net_049: 'OpenVPN® Cipher Method',
  net_049_tip: 'The cipher method of OpenVPN®, must be the same cipher method used by the OpenVPN® server.',

  net_050: 'OpenVPN® Username',
  net_050_tip: 'OpenVPN® authentication username (optional).',

  net_051: 'OpenVPN® Password',
  net_051_tip: 'OpenVPN® authentication password (optional).',

  net_052: 'Preferred DNS 1',
  net_052_tip: 'Configures the preferred DNS 1 address.',

  net_053: 'Preferred DNS 2',
  net_053_tip: 'Configures the preferred DNS 2 address.',

  net_054: 'Enable LLDP',
  net_054_tip: 'If enabled, the device will accept VLAN, QoS and other parameters sent in LLDP packet from the switch in the network. The default setting is "Yes".',

  net_055: 'Enable CDP',
  net_055_tip: 'Configures whether to enable CDP to receive and/or transmit information from/to CDP-enabled devices.',

  net_056: 'Layer 3 QoS For SIP',
  net_056_tip: 'This field defines the Layer 3 QoS parameter for IP Precedence, Diff-Serv or MPLS. The default setting is 26.',

  net_057: 'Layer 3 QoS For audio',
  net_057_tip: 'Defines the Layer 3 QoS parameter for audio packets. This value is used for IP Precedence, Diff-Serv or MPLS. The default setting is 46.',

  net_058: 'Layer 3 QoS For video',
  net_058_tip: 'Defines the Layer 3 QoS parameter for video packets. This value is used for IP Precedence, Diff-Serv or MPLS. The default setting is 34.',

  net_059: 'HTTP/HTTPS User-agent',
  net_059_tip: 'This sets the user-agent for HTTP/HTTPS request.',

  net_060: 'SIP User-agent',
  net_060_tip: 'This sets the user-agent for SIP. If the value includes word "$version", will replace it with the real system version.',

  net_061: 'HTTP/HTTPS Proxy Hostname',
  net_061_tip: 'Specifies the HTTP/HTTPS proxy host name for the device to send packets to.',

  net_062: 'HTTP/HTTPS Proxy Port',
  net_062_tip: 'Specifies the HTTP/HTTPS proxy port for the device to send packets to. The proxy server will act as an intermediary to route the packets to the destination.',

  net_063: 'Bypass Proxy For',
  net_063_tip: 'Defines the destination IP address where no proxy server is needed. The device will not use a proxy server when sending packets to the specified destination IP address.',

  net_064: 'LLDP TX Interval(s)',
  net_064_tip: 'Configures the interval the phone sends LLDP-MED packets.'
}
