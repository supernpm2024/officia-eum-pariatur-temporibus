
const { parseImage, parseKeyword } = require('../parsers.js')

function parse(v) {
    return parseImage(v) || parseKeyword(v, ['none'])
}

module.exports.parse = parse
