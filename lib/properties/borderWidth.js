
const { parseImplicitShorthand, parseKeyword, parseLength, serializeImplicitShorthand } = require('../parsers.js')

function parseLonghand(v) {
    return parseLength(v) || parseKeyword(v, ['medium', 'thick', 'thin'])
}

/* eslint-disable sort-keys */
const longhandsMap = {
    'border-top-width': parseLonghand,
    'border-right-width': parseLonghand,
    'border-bottom-width': parseLonghand,
    'border-left-width': parseLonghand,
}
/* eslint-enable sort-keys */
const longhands = Object.keys(longhandsMap)

function parse(value) {
    return parseImplicitShorthand(value, longhandsMap)
}

module.exports = {
    longhands,
    parse,
    parseLonghand,
    serialize: serializeImplicitShorthand,
}
