
const { parse: parseFlexBasis } = require('./flexBasis.js')
const { parse: parseFlexGrow } = require('./flexGrow.js')
const { parse: parseFlexShrink } = require('./flexShrink.js')
const { parseShorthand } = require('../parsers.js')

/* eslint-disable sort-keys */
const longhandsMap = {
    'flex-grow': parseFlexGrow,
    'flex-shrink': parseFlexShrink,
    'flex-basis': parseFlexBasis,
}
/* eslint-enable sort-keys */
const longhands = Object.keys(longhandsMap)

function parse(value) {
    if (value.toLowerCase() === 'none') {
        return {
            'flex-basis': 'auto',
            'flex-grow': '0',
            'flex-shrink': '0',
        }
    }
    const parsed = parseShorthand(value, longhandsMap)
    if (parsed) {
        if (parsed['flex-grow'] === 'initial') {
            parsed['flex-grow'] = '1'
        }
        if (parsed['flex-shrink'] === 'initial') {
            parsed['flex-shrink'] = '1'
        }
        if (parsed['flex-basis'] === 'initial') {
            parsed['flex-basis'] = '0%'
        }
    }
    return parsed
}

module.exports = {
    longhands,
    parse,
}
