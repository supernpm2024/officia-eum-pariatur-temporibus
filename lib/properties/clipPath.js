
const {
    parseBasicShape,
    parseGeometryBox,
    parseKeyword,
    parseResource,
    splitTokens,
} = require('../parsers.js')

function parseShapeGeometry(value) {
    const [args] = splitTokens(value)
    if (args.length === 2) {
        let shape = parseBasicShape(args[0])
        let box = parseGeometryBox(args[1])
        if (!shape && !box) {
            shape = parseBasicShape(args[1])
            box = parseGeometryBox(args[0])
        }
        if (shape && box) {
            return `${shape} ${box}`
        }
    }
    return parseBasicShape(value) || parseGeometryBox(value)
}

function parse(value) {
    return parseResource(value) || parseShapeGeometry(value) || parseKeyword(value, ['none'])
}

module.exports.parse = parse
