
const { parseLength } = require('../parsers.js')

/**
 * <length> <length>? | inherit
 * if one, it applies to both horizontal and verical spacing
 * if two, the first applies to the horizontal and the second applies to vertical spacing
 */
function parse(value) {
    var parts = value.split(/\s+/)
    if (parts.length !== 1 && parts.length !== 2) {
        return null
    }
    if (parts.every((part, i) => (parts[i] = parseLength(part)))) {
        return parts.join(' ')
    }
    return null
}

module.exports.parse = parse
