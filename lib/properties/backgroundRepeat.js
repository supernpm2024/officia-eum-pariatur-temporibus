
const { parseKeyword } = require('../parsers.js')

function parse(v) {
    return parseKeyword(v, ['no-repeat', 'repeat', 'repeat-x', 'repeat-y', 'round', 'space'])
}

module.exports.parse = parse
