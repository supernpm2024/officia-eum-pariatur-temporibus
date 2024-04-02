
const { parseCustomIdentifier, parseString, splitTokens, ws } = require('../parsers.js')

const separator = new RegExp(`${ws},${ws}`)

function parse(value) {
    const [parts] = splitTokens(value, separator)
    if (parts.every((part, i) => (parts[i] = parseString(part) || parseCustomIdentifier(part)))) {
        return parts.join(', ')
    }
    return null
}

module.exports.parse = parse
