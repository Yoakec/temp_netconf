## 1. Create JSON snippet files

- [x] 1.1 Create `utils/snippets/huawei/ce-vrp8.json` — CE系列 snippets (Base, BGP_Leaf, M-LAG, VLAN)
- [x] 1.2 Create `utils/snippets/huawei/s-vrp5.json` — S系列 snippets (Base, Stack, ACL)
- [x] 1.3 Create `utils/snippets/huawei/usg.json` — USG系列 snippets (Base, NAT, IPSec_VPN)
- [x] 1.4 Create `utils/snippets/h3c/s-comware-v7.json` — H3C S系列 snippets (Base, IRF, OSPF)
- [x] 1.5 Create `utils/snippets/cisco/nexus-nxos.json` — Cisco Nexus snippets (Base, vPC, BGP_Leaf)

## 2. Create auto-discovery index

- [x] 2.1 Create `utils/snippets/index.js` with `import.meta.glob('./*/*.json', { eager: true })`
- [x] 2.2 Add `vendorMap` and `seriesMap` dictionaries (English path → Chinese UI name)
- [x] 2.3 Implement dynamic `snippetTree` assembly loop — iterate glob keys, parse path, apply maps, build tree

## 3. Update import and cleanup

- [x] 3.1 Update `stores/snippetStore.js` import: `'../utils/snippetLibrary.js'` → `'../utils/snippets/index.js'`
- [x] 3.2 Delete `utils/snippetLibrary.js`

## 4. Verify

- [x] 4.1 Verify build passes with new JSON-based snippet loading
- [x] 4.2 Verify snippet tree renders correctly in Snippet Builder mode (all vendors, series, snippets visible)
- [x] 4.3 Verify snippet selection, form filling, and rendering still work end-to-end
