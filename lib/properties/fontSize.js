
const { parseKeyword, parseLengthOrPercentage } = require('../parsers.js')

const sizes = [
    // Absolute
    'xx-small',
    'x-small',
    'small',
    'medium',
    'large',
    'x-large',
    'xx-large',
    // Relative
    'larger',
    'smaller',
]

function parse(value) {
    return parseKeyword(value, sizes) || parseLengthOrPercentage(value)
}

module.exports.parse = parse
