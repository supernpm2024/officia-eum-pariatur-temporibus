
const { parseBorderRadius, parseLengthOrPercentage, serializeBorderRadius, splitTokens } = require('../parsers.js')

function parseLonghand(value) {
    const [radii] = splitTokens(value)
    if (radii.every((radius, i) => (radii[i] = parseLengthOrPercentage(radius)))) {
        const [horizontal, vertical] = radii
        if (horizontal === vertical) {
            return horizontal
        }
        return radii.join(' ')
    }
    return null
}

function serializeLonghand(value) {
    const [radii] = splitTokens(value)
    const [horizontal, vertical] = radii
    if (horizontal === vertical) {
        return horizontal
    }
    return radii.join(' ')
}

/* eslint-disable sort-keys */
const longhandsMap = {
    'border-top-left-radius': '',
    'border-top-right-radius': '',
    'border-bottom-right-radius': '',
    'border-bottom-left-radius': '',
}
/* eslint-enable sort-keys */
const longhands = Object.keys(longhandsMap)

function parse(value) {
    const longhands = { ...longhandsMap }
    const parts = parseBorderRadius(value, false)
    if (parts) {
        const [horizontal, vertical = horizontal] = parts
        longhands['border-top-left-radius'] = `${horizontal[0]} ${vertical[0]}`
        longhands['border-top-right-radius'] = `${horizontal[1]} ${vertical[1]}`
        longhands['border-bottom-right-radius'] = `${horizontal[2]} ${vertical[2]}`
        longhands['border-bottom-left-radius'] = `${horizontal[3]} ${vertical[3]}`
        return longhands
    }
    return null
}

function serialize(components) {
    return serializeBorderRadius(
        components.reduce(
            (parts, value) => {
                const [[horizontal, vertical = horizontal]] = splitTokens(value)
                parts[0].push(horizontal)
                parts[1].push(vertical)
                return parts
            },
            [[], []],
        ),
    )
}

module.exports = {
    longhands,
    parse,
    parseLonghand,
    serialize,
    serializeLonghand,
}
