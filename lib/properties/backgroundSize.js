
const { parseKeyword, parseLengthOrPercentage, splitTokens } = require('../parsers.js')

function parse(value) {
    const keyword = parseKeyword(value, ['auto', 'cover', 'contain'])
    if (keyword !== null) {
        return keyword
    }
    const [components] = splitTokens(value)
    const { length: componentsLength } = components
    if (componentsLength > 2) {
        return null
    }
    const size = []
    for (const component of components) {
        const parsed = parseLengthOrPercentage(component)
        if (parsed === null) {
            return null
        }
        size.push(parsed)
    }
    return size.join(' ')
}

module.exports.parse = parse
