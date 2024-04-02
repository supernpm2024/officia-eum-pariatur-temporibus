
const { parseKeyword } = require('../parsers.js')

function parse(value) {
    return parseKeyword(value, ['both', 'left', 'none', 'right'])
}

module.exports.parse = parse
