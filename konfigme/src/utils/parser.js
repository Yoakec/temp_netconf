const VAR_REGEX = /{{\s*(\w+)\s*}}/g

export function parseVariables(templateText) {
  if (!templateText) return []
  const seen = new Set()
  const variables = []
  let match
  while ((match = VAR_REGEX.exec(templateText)) !== null) {
    const name = match[1]
    if (!seen.has(name)) {
      seen.add(name)
      variables.push(name)
    }
  }
  return variables
}
