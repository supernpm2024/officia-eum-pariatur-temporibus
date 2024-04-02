
const { parseKeyword, parseLengthOrPercentage, parseNumber } = require('../parsers.js')

function parse(v) {
    return parseKeyword(v, ['normal']) || parseNumber(v) || parseLengthOrPercentage(v)
}

module.exports.parse = parse
