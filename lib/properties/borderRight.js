
const { parse: parseBorderRightColor } = require('./borderRightColor.js')
const { parse: parseBorderRightStyle } = require('./borderRightStyle.js')
const { parse: parseBorderRightWidth } = require('./borderRightWidth.js')
const { parseShorthand } = require('../parsers.js')

/* eslint-disable sort-keys */
const longhandsMap = {
    'border-right-width': parseBorderRightWidth,
    'border-right-style': parseBorderRightStyle,
    'border-right-color': parseBorderRightColor,
}
/* eslint-enable sort-keys */
const longhands = Object.keys(longhandsMap)

function parse(value) {
    return parseShorthand(value, longhandsMap)
}

module.exports = {
    longhands,
    parse,
}
