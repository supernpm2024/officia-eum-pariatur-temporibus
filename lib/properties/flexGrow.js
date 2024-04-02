
const { POSITION_AT_SHORTHAND } = require('../constants.js')
const { parseNumber } = require('../parsers.js')

function parse(v, positionAtFlexShorthand = POSITION_AT_SHORTHAND.first) {
    const number = parseNumber(v)
    if (number && positionAtFlexShorthand === POSITION_AT_SHORTHAND.first) {
        return number
    }
    return null
}

module.exports.parse = parse
