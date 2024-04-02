
const { parseImplicitShorthand, parseLengthOrPercentage, serializeImplicitShorthand } = require('../parsers.js')

const parseLonghand = parseLengthOrPercentage

/* eslint-disable sort-keys */
const longhandsMap = {
    'padding-top': parseLonghand,
    'padding-right': parseLonghand,
    'padding-bottom': parseLonghand,
    'padding-left': parseLonghand,
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
