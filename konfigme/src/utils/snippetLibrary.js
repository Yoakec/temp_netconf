export const builtInSnippets = [
  {
    name: 'Base_Config',
    category: 'built-in',
    content: `!
hostname {{ hostname }}
!
aaa authentication login default local
aaa authorization exec default local
aaa accounting exec default start-stop group tacacs+
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
  },
  {
    name: 'BGP_Config',
    category: 'built-in',
    content: `!
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
  },
  {
    name: 'M-LAG_Config',
    category: 'built-in',
    content: `!
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
  },
  {
    name: 'ACL_Config',
    category: 'built-in',
    content: `!
ip access-list {{ acl_name }}
 10 permit ip {{ acl_src_net }} {{ acl_src_mask }} {{ acl_dst_net }} {{ acl_dst_mask }}
 20 permit tcp {{ acl_src_net }} {{ acl_src_mask }} any eq {{ acl_permit_port }}
 30 permit icmp any any
 40 deny ip any any log
!
interface {{ acl_interface }}
 ip access-group {{ acl_name }} in`,
  },
  {
    name: 'SNMP_Config',
    category: 'built-in',
    content: `!
snmp-server engineID local {{ snmp_engine_id }}
!
snmp-server group {{ snmp_group }} v3 priv
snmp-server user {{ snmp_user }} {{ snmp_group }} v3 auth sha {{ snmp_auth_pass }} priv aes 128 {{ snmp_priv_pass }}
!
snmp-server host {{ snmp_trap_host }} version 3 priv {{ snmp_user }}
snmp-server enable traps snmp link down
snmp-server enable traps bgp
snmp-server enable traps entity`,
  },
]
