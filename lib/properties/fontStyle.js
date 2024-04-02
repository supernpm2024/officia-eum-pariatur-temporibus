
const { parseKeyword } = require('../parsers.js')

function parse(value) {
    return parseKeyword(value, ['italic', 'normal', 'oblique'])
}

module.exports.parse = parse
