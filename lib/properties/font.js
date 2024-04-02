
const { parseKeyword, parseShorthand } = require('../parsers.js')
const { parse: parseFontFamily } = require('./fontFamily.js')
const { parse: parseFontSize } = require('./fontSize.js')
const { parse: parseFontStyle } = require('./fontStyle.js')
const { parse: parseFontVariant } = require('./fontVariant.js')
const { parse: parseFontWeight } = require('./fontWeight.js')
const { parse: parseLineHeight } = require('./lineHeight.js')

const longhandsMap = {
    'font-family': parseFontFamily,
    'font-size': parseFontSize,
    'font-style': parseFontStyle,
    'font-variant': parseFontVariant,
    'font-weight': parseFontWeight,
    'line-height': parseLineHeight,
}
const longhands = Object.keys(longhandsMap)

const staticFonts = ['caption', 'icon', 'menu', 'message-box', 'small-caption', 'status-bar']

function parse(value) {
    return parseShorthand(value, longhandsMap) || parseKeyword(value, staticFonts)
}

module.exports = {
    longhands,
    parse,
}
