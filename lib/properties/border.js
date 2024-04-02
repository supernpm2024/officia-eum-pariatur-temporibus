
const borderColor = require('./borderColor.js')
const borderStyle = require('./borderStyle.js')
const borderWidth = require('./borderWidth.js')
const { parseShorthand, serializeShorthand } = require('../parsers.js')

/* eslint-disable sort-keys */
const longhandsMap = {
    'border-width': borderWidth.parse,
    'border-style': borderStyle.parse,
    'border-color': borderColor.parse,
}
/* eslint-enable sort-keys */
const longhands = [borderWidth, borderStyle, borderColor].flatMap(({ longhands }) => longhands)

function parse(value) {
    value = parseShorthand(value, longhandsMap)
    if (value === null) {
        return null
    }
    const width = value['border-width']
    if (typeof width === 'string') {
        value['border-width'] = borderWidth.longhands.reduce(
            (value, longhand) => ({ ...value, [longhand]: width }),
            {})
    }
    const style = value['border-style']
    if (typeof style === 'string') {
        value['border-style'] = borderStyle.longhands.reduce(
            (value, longhand) => ({ ...value, [longhand]: style }),
            {})
    }
    const color = value['border-color']
    if (typeof color === 'string') {
        value['border-color'] = borderColor.longhands.reduce(
            (value, longhand) => ({ ...value, [longhand]: color }),
            {})
    }
    return Object.values(value).reduce((all, value) => ({ ...all, ...value }), {})
}

function serialize(components) {
    if (components.every((value, index) => value === components[index - (index % 4)])) {
        return serializeShorthand([components[0], components[4], components[8]])
    }
    return ''
}

module.exports = {
    longhands,
    parse,
    serialize,
}
