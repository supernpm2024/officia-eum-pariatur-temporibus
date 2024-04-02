
const { parse: parseBorderLeftColor } = require('./borderLeftColor.js')
const { parse: parseBorderLeftStyle } = require('./borderLeftStyle.js')
const { parse: parseBorderLeftWidth } = require('./borderLeftWidth.js')
const { parseShorthand } = require('../parsers.js')

/* eslint-disable sort-keys */
const longhandsMap = {
    'border-left-width': parseBorderLeftWidth,
    'border-left-style': parseBorderLeftStyle,
    'border-left-color': parseBorderLeftColor,
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
