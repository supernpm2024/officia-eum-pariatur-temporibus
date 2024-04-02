
const { POSITION_AT_SHORTHAND } = require('../constants.js')
const { parseNumber } = require('../parsers.js')

function parse(v, positionAtFlexShorthand = POSITION_AT_SHORTHAND.second) {
    const number = parseNumber(v)
    if (number && positionAtFlexShorthand === POSITION_AT_SHORTHAND.second) {
        return number
    }
    return null
}

module.exports.parse = parse
