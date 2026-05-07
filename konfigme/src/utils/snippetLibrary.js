export const snippetTree = {
  '华为 (Huawei)': {
    'CE系列 (VRP8)': {
      'Base_基础配置': `!
hostname {{ hostname }}
!
aaa authentication login default local
aaa authorization exec default local
!
username admin privilege 15 role network-admin secret {{ admin_secret }}
!
snmp-server community {{ snmp_ro }} ro
snmp-server community {{ snmp_rw }} rw
snmp-server location {{ snmp_location }}
snmp-server contact {{ snmp_contact }}
!
ntp server {{ ntp_server_1 }} prefer
ntp server {{ ntp_server_2 }}
!
logging server {{ syslog_server }} severity informational
!
spanning-tree mode {{ stp_mode }}
!
vlan {{ mgmt_vlan }}
 name MGMT
!
interface Vlan{{ mgmt_vlan }}
 ip address {{ mgmt_ip }} {{ mgmt_mask }}
 no shutdown`,
      'BGP_Leaf节点': `!
router bgp {{ local_as }}
 router-id {{ bgp_router_id }}
 maximum-paths {{ bgp_max_paths }}
 !
 neighbor {{ peer_ip_1 }} remote-as {{ neighbor_as_1 }}
 neighbor {{ peer_ip_1 }} description {{ peer_desc_1 }}
 neighbor {{ peer_ip_1 }} update-source {{ bgp_update_source }}
 !
 neighbor {{ peer_ip_2 }} remote-as {{ neighbor_as_2 }}
 neighbor {{ peer_ip_2 }} description {{ peer_desc_2 }}
 neighbor {{ peer_ip_2 }} update-source {{ bgp_update_source }}
 !
 address-family ipv4 unicast
  network {{ bgp_network_1 }} mask {{ bgp_mask_1 }}
  network {{ bgp_network_2 }} mask {{ bgp_mask_2 }}
  redistribute connected
 exit-address-family`,
      'M-LAG_双活': `!
mlag configuration
 peer-link {{ mlag_peer_link }}
 peer-address {{ mlag_peer_ip }}
 mlag system-id {{ mlag_system_id }}
 mlag domain-id {{ mlag_domain_id }}
 !
interface {{ mlag_peer_link }}
 mlag peer-link
 !
interface Port-Channel{{ mlag_port_channel }}
 mlag {{ mlag_port_channel }}`,
      'VLAN_标准规划': `!
vlan batch {{ vlan_start }} to {{ vlan_end }}
!
interface Vlan{{ mgmt_vlan }}
 description Management
 ip address {{ mgmt_ip }} {{ mgmt_mask }}
!
interface Vlan{{ prod_vlan }}
 description Production
 ip address {{ prod_gw }} {{ prod_mask }}
 ip helper-address {{ dhcp_server }}
!
interface {{ uplink_interface }}
 port link-type trunk
 port trunk allow-pass vlan {{ vlan_start }} to {{ vlan_end }}`,
    },
    'S系列 (VRP5)': {
      'Base_基础配置': `!
sysname {{ sysname }}
!
super password cipher {{ super_pass }}
!
aaa
 local-user admin password cipher {{ admin_pass }}
 local-user admin privilege level 15
 local-user admin service-type telnet ssh
!
user-interface vty 0 4
 authentication-mode aaa
 protocol inbound all
!
snmp-agent community read {{ snmp_ro }}
snmp-agent community write {{ snmp_rw }}
snmp-agent sys-info location {{ snmp_location }}
snmp-agent sys-info contact {{ snmp_contact }}
!
ntp-service unicast-server {{ ntp_server_1 }}
!
vlan {{ mgmt_vlan }}
!
interface Vlanif{{ mgmt_vlan }}
 ip address {{ mgmt_ip }} {{ mgmt_mask }}`,
      'Stack_堆叠配置': `!
stack slot 0 priority 200
stack slot 1 priority 180
!
stack timer mac-address switch-delay 300
!
interface Stack-Port1/1
 port interface XGigabitEthernet1/1/0 to XGigabitEthernet1/1/2 enable
!
interface Stack-Port2/1
 port interface XGigabitEthernet2/1/0 to XGigabitEthernet2/1/2 enable`,
      'ACL_访问控制': `!
acl number {{ acl_number }}
 rule 10 permit ip source {{ src_net }} {{ src_mask }} destination {{ dst_net }} {{ dst_mask }}
 rule 20 permit tcp source any destination any destination-port eq {{ permit_port }}
 rule 30 permit icmp source any destination any
 rule 100 deny ip source any destination any`,
    },
    'USG系列 (防火墙)': {
      'Base_基础配置': `!
sysname {{ sysname }}
!
firewall zone trust
 set priority 85
 add interface {{ trust_interface }}
!
firewall zone untrust
 set priority 5
 add interface {{ untrust_interface }}
!
firewall zone dmz
 set priority 50
 add interface {{ dmz_interface }}
!
security-policy
 rule name Allow_Trust_to_Untrust
  source-zone trust
  destination-zone untrust
  source-address any
  destination-address any
  action permit`,
      'NAT_地址转换': `!
nat-policy
 rule name SNAT_Internet
  source-zone trust
  destination-zone untrust
  source-address {{ internal_net }} {{ internal_mask }}
  action source-nat easy-ip
!
nat server Global_Web protocol tcp global {{ public_ip }} {{ public_port }} inside {{ web_server_ip }} {{ web_port }}
nat server Global_SSH protocol tcp global {{ public_ip }} 2222 inside {{ ssh_server_ip }} 22`,
      'IPSec_VPN': `!
ike proposal {{ ike_proposal }}
 encryption-algorithm aes-256
 dh group14
 authentication-algorithm sha2-256
!
ike peer {{ ike_peer_name }}
 pre-shared-key cipher {{ psk }}
 remote-address {{ remote_peer_ip }}
!
ipsec proposal {{ ipsec_proposal }}
 esp authentication-algorithm sha2-256
 esp encryption-algorithm aes-256
!
ipsec policy {{ ipsec_policy }} 10 isakmp
 security acl {{ ipsec_acl }}
 ike-peer {{ ike_peer_name }}
 proposal {{ ipsec_proposal }}
!
ipsec policy {{ ipsec_policy }} enable`,
    },
  },
  '华三 (H3C)': {
    'S系列 (Comware V7)': {
      'Base_基础配置': `!
sysname {{ sysname }}
!
telnet server enable
!
local-user admin class manage
 password simple {{ admin_pass }}
 service-type telnet ssh http https
 authorization-attribute user-role network-admin
!
line vty 0 63
 authentication-mode scheme
!
snmp-agent community read {{ snmp_ro }}
snmp-agent community write {{ snmp_rw }}
snmp-agent sys-info location {{ snmp_location }}
snmp-agent sys-info contact {{ snmp_contact }}
!
ntp-service unicast-server {{ ntp_server_1 }}
!
vlan {{ mgmt_vlan }}
!
interface Vlan-interface{{ mgmt_vlan }}
 ip address {{ mgmt_ip }} {{ mgmt_mask }}`,
      'IRF_堆叠配置': `!
irf member 1 priority 32
irf member 1 description {{ irf_member_1_desc }}
irf member 2 priority 30
irf member 2 description {{ irf_member_2_desc }}
!
irf-port 1/1
 port group interface Ten-GigabitEthernet1/0/1
 port group interface Ten-GigabitEthernet1/0/2
!
irf-port 2/2
 port group interface Ten-GigabitEthernet2/0/1
 port group interface Ten-GigabitEthernet2/0/2
!
irf mac-address persistent timer
irf auto-update enable`,
      'OSPF_路由配置': `!
ospf 1 router-id {{ ospf_router_id }}
 area {{ ospf_area }}
  network {{ ospf_net_1 }} {{ ospf_mask_1 }}
  network {{ ospf_net_2 }} {{ ospf_mask_2 }}
!
interface {{ ospf_interface }}
 ospf network-type p2p
 ospf cost {{ ospf_cost }}`,
    },
  },
  '思科 (Cisco)': {
    'Nexus系列 (NX-OS)': {
      'Base_基础配置': `!
hostname {{ hostname }}
!
feature vpc
feature lacp
feature bgp
feature interface-vlan
!
spanning-tree mode rapid-pvst
!
vlan {{ mgmt_vlan }}
 name MGMT
!
interface Vlan{{ mgmt_vlan }}
 ip address {{ mgmt_ip }} {{ mgmt_mask }}
 no shutdown
!
ntp server {{ ntp_server_1 }} use-vrf management
!
snmp-server community {{ snmp_ro }} ro
snmp-server location {{ snmp_location }}
snmp-server contact {{ snmp_contact }}`,
      'vPC_双活': `!
vpc domain {{ vpc_domain }}
 peer-keepalive destination {{ vpc_peer_keepalive_ip }} source {{ vpc_local_keepalive_ip }}
!
interface port-channel{{ vpc_peer_link_po }}
 vpc peer-link
!
interface port-channel{{ vpc_po }}
 vpc {{ vpc_po_id }}
!
interface Ethernet1/{{ downlink_if }}
 channel-group {{ vpc_po }} mode active`,
      'BGP_Leaf节点': `!
router bgp {{ local_as }}
 router-id {{ bgp_router_id }}
 !
 neighbor {{ spine_ip_1 }} remote-as {{ spine_as }}
 neighbor {{ spine_ip_1 }} description {{ spine_desc_1 }}
 neighbor {{ spine_ip_1 }} update-source loopback0
 !
 neighbor {{ spine_ip_2 }} remote-as {{ spine_as }}
 neighbor {{ spine_ip_2 }} description {{ spine_desc_2 }}
 neighbor {{ spine_ip_2 }} update-source loopback0
 !
 address-family ipv4 unicast
  network {{ bgp_network }} mask {{ bgp_mask }}
  maximum-paths {{ bgp_max_paths }}
  redistribute direct route-map {{ route_map_name }}`,
    },
  },
}
