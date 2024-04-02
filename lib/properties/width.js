
const { parseKeyword, parseLengthOrPercentage } = require('../parsers.js')

function parse(value) {
    return parseKeyword(value, ['auto']) || parseLengthOrPercentage(value)
}

module.exports.parse = parse
