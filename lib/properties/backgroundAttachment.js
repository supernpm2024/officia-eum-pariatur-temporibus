
const { parseKeyword } = require('../parsers.js')

function parse(v) {
    return parseKeyword(v, ['fixed', 'local', 'scroll'])
}

module.exports.parse = parse
