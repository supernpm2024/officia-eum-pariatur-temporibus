
const { parseImplicitShorthand, parseKeyword, parseLengthOrPercentage, serializeImplicitShorthand } = require('../parsers.js')

function parseLonghand(value) {
    return parseKeyword(value, ['auto']) || parseLengthOrPercentage(value)
}

/* eslint-disable sort-keys */
const longhandsMap = {
    'margin-top': parseLonghand,
    'margin-right': parseLonghand,
    'margin-bottom': parseLonghand,
    'margin-left': parseLonghand,
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
