
const { parseAngle } = require('../parsers.js')

function parse(value) {

    const angle = parseAngle(value)
    if (angle !== null) {
        return angle
    }
    const keywords = value.toLowerCase().trim().split(/\s+/)
    let hasBehind = false
    if (keywords.length > 2) {
        return null
    }
    const behindIndex = keywords.indexOf('behind')
    hasBehind = behindIndex !== -1

    if (keywords.length === 2) {
        if (!hasBehind) {
            return null
        }
        keywords.splice(behindIndex, 1)
    }
    if (keywords[0] === 'leftwards' || keywords[0] === 'rightwards') {
        if (hasBehind) {
            return null
        }
        return keywords[0]
    }
    if (keywords[0] === 'behind') {
        return '180deg'
    }
    switch (keywords[0]) {
        case 'left-side':
            return '270deg'
        case 'far-left':
            return `${hasBehind ? 240 : 300}deg`
        case 'left':
            return `${hasBehind ? 220 : 320}deg`
        case 'center-left':
            return `${hasBehind ? 200 : 340}deg`
        case 'center':
            return `${hasBehind ? 180 : 0}deg`
        case 'center-right':
            return `${hasBehind ? 160 : 20}deg`
        case 'right':
            return `${hasBehind ? 140 : 40}deg`
        case 'far-right':
            return `${hasBehind ? 120 : 60}deg`
        case 'right-side':
            return '90deg'
        default:
            return null
    }
}

module.exports.parse = parse
