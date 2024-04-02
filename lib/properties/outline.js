
const { parse: parseOutlineColor } = require('./outlineColor.js')
const { parse: parseOutlineStyle } = require('./outlineStyle.js')
const { parse: parseOutlineWidth } = require('./outlineWidth.js')
const { parseShorthand } = require('../parsers.js')

const longhandsMap = {
    'outline-color': parseOutlineColor,
    'outline-style': parseOutlineStyle,
    'outline-width': parseOutlineWidth,
}
const longhands = Object.keys(longhandsMap)

function parse(value) {
    return parseShorthand(value, longhandsMap)
}

module.exports = {
    longhands,
    parse,
}
