
const { parseColor, parseImplicitShorthand, serializeImplicitShorthand } = require('../parsers.js')

/* eslint-disable sort-keys */
const longhandsMap = {
    'border-top-color': parseColor,
    'border-right-color': parseColor,
    'border-bottom-color': parseColor,
    'border-left-color': parseColor,
}
/* eslint-enable sort-keys */
const longhands = Object.keys(longhandsMap)

function parse(value) {
    return parseImplicitShorthand(value, longhandsMap)
}

module.exports = {
    longhands,
    parse,
    parseLonghand: parseColor,
    serialize: serializeImplicitShorthand,
}
