const reg = /([\S])(?!\S{3})/gm
const regJsonString = /(.{3})(?=",|"})/gm

function obfuscate(content, after = [], keepList = []) {
  let typed = typeof content

  switch (typed) {
    // eslint-disable-next-line no-fallthrough
    case 'object':
      if (Array.isArray(content)) {
        return content.map((x) => obfuscate(x))
      }

      const contentToString = (content != undefined && content.toString()) || '[obj'

      if (contentToString.substring(0, 4) === '[obj') {
        return deepProcess(content, after, keepList)
      } else {
        return contentToString
      }

    case 'bigint':
    case 'number':
      content = String(content)
      typed = 'string'

    // eslint-disable-next-line no-fallthrough
    case 'string':
      return content.replace(regJsonString, '___').replace(reg, '_')
  }

  return content
}

function deepProcess(obj, after = [], keepList = []) {
  if (!obj) {
    return obj
  }

  const withAfter = (k, v) => ({
    [k]: k in after ? obfuscate(v, [], keepList) : obfuscate(v, after, keepList),
  })

  const withoutAfter = (k, v) => ({
    [k]: obfuscate(v, [], keepList),
  })

  const shouldAfter = after.length == 0 ? withoutAfter : withAfter

  return Object.entries(obj)
    .map(([k, v]) => shouldAfter(k, v))
    .reduce((obj, newobj) => {
      return {
        ...obj,
        ...newobj,
      }
    }, {})
}

module.exports = {
  obfuscate
};
