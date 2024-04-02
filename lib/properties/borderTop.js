
const { parse: parseBorderTopColor } = require('./borderTopColor.js')
const { parse: parseBorderTopStyle } = require('./borderTopStyle.js')
const { parse: parseBorderTopWidth } = require('./borderTopWidth.js')
const { parseShorthand } = require('../parsers.js')

/* eslint-disable sort-keys */
const longhandsMap = {
    'border-top-width': parseBorderTopWidth,
    'border-top-style': parseBorderTopStyle,
    'border-top-color': parseBorderTopColor,
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
