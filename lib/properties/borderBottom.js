
const { parse: parseBorderBottomColor } = require('./borderBottomColor.js')
const { parse: parseBorderBottomStyle } = require('./borderBottomStyle.js')
const { parse: parseBorderBottomWidth } = require('./borderBottomWidth.js')
const { parseShorthand } = require('../parsers.js')

/* eslint-disable sort-keys */
const longhandsMap = {
    'border-bottom-width': parseBorderBottomWidth,
    'border-bottom-style': parseBorderBottomStyle,
    'border-bottom-color': parseBorderBottomColor,
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
