const modules = import.meta.glob('./**/*.json', { eager: true })

const vendorMap = {
  'huawei': '华为 (Huawei)',
  'h3c': '华三 (H3C)',
  'ruijie': '锐捷 (Ruijie)',
  'maipu': '迈普 (Maipu)',
  'cisco': '思科 (Cisco)',
}

const seriesMap = {
  'ce-vrp8': 'CE系列 (VRP8)',
  's-vrp5': 'S系列 (VRP5)',
  's-comware-v7': 'S系列 (Comware V7)',
  's-rgos': 'S系列 (RGOS)',
  's-mpnos': 'S系列 (MPNOS)',
  'nexus-nxos': 'Nexus系列 (NX-OS)',
  'usg': 'USG系列 (防火墙)',
}

export const snippetTree = {}

for (const path in modules) {
  const parts = path.split('/')
  // path: './huawei/ce-vrp8/base.json' (3-level) or './huawei/usg.json' (2-level)
  const vendorDir = parts[1]
  const second = parts[2]
  const third = parts[3]

  const vendorName = vendorMap[vendorDir] || vendorDir

  if (!snippetTree[vendorName]) {
    snippetTree[vendorName] = {}
  }

  if (third) {
    // 3-level: ./vendor/series/file.json
    const seriesName = seriesMap[second] || second
    if (!snippetTree[vendorName][seriesName]) {
      snippetTree[vendorName][seriesName] = {}
    }
    const data = modules[path].default || modules[path]
    Object.assign(snippetTree[vendorName][seriesName], data)
  } else {
    // 2-level: ./vendor/file.json (flat, e.g. usg.json)
    const seriesName = seriesMap[second.replace('.json', '')] || second.replace('.json', '')
    const data = modules[path].default || modules[path]
    snippetTree[vendorName][seriesName] = data
  }
}
