
const { parseImplicitShorthand, parseKeyword, serializeImplicitShorthand } = require('../parsers.js')

const styles = [
    'none',
    'hidden',
    'dotted',
    'dashed',
    'solid',
    'double',
    'groove',
    'ridge',
    'inset',
    'outset',
]

function parseLonghand(v) {
    return parseKeyword(v, styles)
}

/* eslint-disable sort-keys */
const longhandsMap = {
    'border-top-style': parseLonghand,
    'border-right-style': parseLonghand,
    'border-bottom-style': parseLonghand,
    'border-left-style': parseLonghand,
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
