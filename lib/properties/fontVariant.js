
const { parseKeyword } = require('../parsers.js')

function parse(value) {
    return parseKeyword(value, ['normal', 'small-caps'])
}

module.exports.parse = parse
