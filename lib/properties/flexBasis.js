
const { parseKeyword, parseLengthOrPercentage } = require('../parsers.js')

function parse(v) {
    return parseKeyword(v, ['auto']) || parseLengthOrPercentage(v)
}

module.exports.parse = parse
