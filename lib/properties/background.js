
const { serializeShorthand, splitTokens, ws } = require('../parsers.js')
const { parse: parseBackgroundAttachment } = require('./backgroundAttachment.js')
const { parse: parseBackgroundClip } = require('./backgroundClip.js')
const { parse: parseBackgroundColor } = require('./backgroundColor.js')
const { parse: parseBackgroundImage } = require('./backgroundImage.js')
const { parse: parseBackgroundOrigin } = require('./backgroundOrigin.js')
const { parse: parseBackgroundPosition } = require('./backgroundPosition.js')
const { parse: parseBackgroundRepeat } = require('./backgroundRepeat.js')
const { parse: parseBackgroundSize } = require('./backgroundSize.js')

/* eslint-disable sort-keys */
const longhandsMap = {
    'background-color': parseBackgroundColor,
    'background-image': parseBackgroundImage,
    'background-repeat': parseBackgroundRepeat,
    'background-attachment': parseBackgroundAttachment,
    'background-position': parseBackgroundPosition,
    'background-size': parseBackgroundSize,
    'background-origin': parseBackgroundOrigin,
    'background-clip': parseBackgroundClip,
}
/* eslint-enable sort-keys */
const longhands = Object.keys(longhandsMap)
const singleComponent = [
    'background-color',
    'background-image',
    'background-attachment',
    'background-origin',
    'background-clip',
]
const splitIndex = longhands.indexOf('background-size')
const separatorRegExp = new RegExp(`${ws}/${ws}`)

/**
 * @param {string} value
 * @returns {object | null}
 *
 * TODO: parse multiple <layer> and return null if <color> is parsed in the
 * first layers.
 */
function parse(value) {
    const parsed = {}
    const [components] = splitTokens(value)

    // First parse single component longhands
    for (let i = 0; i < components.length; i++) {
        const component = components[i]
        singleComponent.some(property => {
            if (!parsed[property]) {
                const value = longhandsMap[property](component)
                if (value) {
                    parsed[property] = value
                    components.splice(i--, 1)
                    return true
                }
            }
            return false
        })
    }

    // Assign default value to unparsed longhands
    longhands.forEach(property => {
        if (parsed[property]) {
            return
        }
        if (property === 'background-clip') {
            parsed[property] = parsed['background-origin']
        } else {
            parsed[property] = 'initial'
        }
    })

    if (components.length === 0) {
        return parsed
    }

    // Parse <repeat>
    const repeatComponents = []
    const repeatComponentIndex = 0
    for (let j = 0; j < components.length; j++) {
        const component = components[j]
        const repeat = parseBackgroundRepeat(component)
        if (repeat) {
            // First or consecutive <repeat>
            if (repeatComponentIndex === 0 || repeatComponentIndex - j === -1) {
                repeatComponents.push(component)
                components.splice(j--, 1)
                continue
            }
            return null
        }
    }
    if (repeatComponents.length > 0) {
        parsed['background-repeat'] = parseBackgroundRepeat(repeatComponents.join(' '))
        if (!parsed['background-repeat']) {
            return null
        }
    }

    if (components.length === 0) {
        return parsed
    }

    // <position> and <size> are now the only component values left

    // Parse <position> / <size> (separator has been split as a component)
    const splitIndex = components.indexOf('/')
    if (splitIndex > -1) {
        parsed['background-position'] = parseBackgroundPosition(components.slice(0, splitIndex).join(' '))
        parsed['background-size'] = parseBackgroundSize(components.slice(splitIndex + 1).join(' '))
        if (parsed['background-position'] && parsed['background-size']) {
            return parsed
        }
        return null
    }

    const splittedComponents = components.map(value => splitTokens(value, separatorRegExp))

    // <position> (without <size>)
    if (splittedComponents.filter(([values]) => values.length > 1).length === 0) {
        parsed['background-position'] = parseBackgroundPosition(components.join(' '))
        if (parsed['background-position']) {
            return parsed
        }
        return null
    }

    // Flatten splitted <position> and <size> and filter out empty string
    const positionAndSize = splittedComponents.reduce(
        (components, [values]) => components.concat(values.filter(Boolean)),
        [])

    // <position>/<size> (both single component)
    if (components.length === 1) {
        const [position, size] = positionAndSize
        parsed['background-position'] = parseBackgroundPosition(position)
        parsed['background-size'] = parseBackgroundSize(size)
        if (parsed['background-position'] && parsed['background-size']) {
            return parsed
        }
        return null
    }

    // <position>/ <size>
    const lastPositionIndex = components.findIndex(value => value.endsWith('/'))
    if (lastPositionIndex > -1) {
        parsed['background-position'] = parseBackgroundPosition(positionAndSize.slice(0, lastPositionIndex + 1).join(' '))
        parsed['background-size'] = parseBackgroundSize(components.slice(lastPositionIndex + 1).join(' '))
        if (parsed['background-position'] && parsed['background-size']) {
            return parsed
        }
        return null
    }

    // <position> /<size>
    const lastSizeIndex = components.findIndex(value => value.startsWith('/'))
    if (lastSizeIndex > -1) {
        parsed['background-position'] = parseBackgroundPosition(components.slice(0, lastSizeIndex).join(' '))
        parsed['background-size'] = parseBackgroundSize(positionAndSize.slice(lastSizeIndex).join(' '))
        if (parsed['background-position'] && parsed['background-size']) {
            return parsed
        }
        return null
    }

    return parsed
}

function serialize(components) {
    // <size> has not been specified
    if (components[splitIndex] === 'initial') {
        return serializeShorthand(components)
    }
    return serializeShorthand(
        [
            serializeShorthand(components.slice(0, splitIndex)),
            serializeShorthand(components.slice(splitIndex)),
        ],
        ' / ',
    )
}

module.exports = {
    longhands,
    parse,
    serialize,
}
