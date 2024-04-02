
const { parseKeyword } = require('../parsers.js')

function parse(value) {
    return parseKeyword(value, ['collapse', 'separate'])
}

module.exports.parse = parse
