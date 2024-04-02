
const { parseInteger, parseKeyword } = require('../parsers.js')

function parse(v) {
    const integer = parseInteger(v)
    if (integer) {
        if (integer < 1 || 1000 < integer) {
            return null
        }
        return integer
    }
    return parseKeyword(v, ['bold', 'bolder', 'lighter', 'normal'])
}

module.exports.parse = parse
