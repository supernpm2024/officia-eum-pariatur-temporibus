
const { parseKeyword, parseLengthOrPercentage, splitTokens, whitespace, ws } = require('../parsers.js')

const shapeRegEx = new RegExp(`^rect\\(${ws}(.+)${ws}\\)$`, 'i')
const separatorRegEx = new RegExp(`,|${whitespace}`)

function parse(value) {
    const keyword = parseKeyword(value, ['auto'])
    if (keyword !== null) {
        return keyword
    }
    const matches = value.match(shapeRegEx)
    if (!matches) {
        return null
    }
    let [parts] = splitTokens(matches[1], separatorRegEx)
    if (parts.length !== 4) {
        return null
    }
    const valid = parts.every((part, index) => {
        const measurement = parseLengthOrPercentage(part)
        parts[index] = measurement
        return measurement !== null
    })
    if (!valid) {
        return null
    }
    parts = parts.join(', ')
    return value.replace(matches[1], parts)
}

module.exports.parse = parse
