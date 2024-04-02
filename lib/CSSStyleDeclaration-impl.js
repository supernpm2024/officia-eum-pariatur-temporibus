
const { cssPropertyToIDLAttribute, parseKeyword, serializeShorthand } = require('./parsers.js')
const CSSOM = require('cssom')
const idlUtils = require('./utils.js')
const implementedProperties = require('./implementedProperties.js')
const supportedProperties = require('./supportedProperties.js')

class CSSStyleDeclarationImpl {

    #declarations = new Map()
    #declared = []
    #onChange

    /**
     * @constructor
     * @param {object} globalObject
     * @param {*[]} args
     * @param {object} privateData
     * @param {((cssText: string) => void) | null} [privateData.onChangeCallback]
     * @see https://drafts.csswg.org/cssom/#cssstyledeclaration
     */
    constructor(globalObject, args, { onChangeCallback }) {
        this._globalObject = globalObject
        this.#onChange = onChangeCallback ?? (() => {})
        this.parentRule = null
    }

    /**
     * @returns {string}
     * @see https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-cssfloat
     */
    get cssFloat() {
        return this.getPropertyValue('float')
    }

    /**
     * @param {string} value
     * @see https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-cssfloat
     */
    set cssFloat(value) {
        this.setProperty('float', value)
    }

    /**
     * @returns {string}
     * @see https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-csstext
     */
    get cssText() {
        return serializeCSSDeclarationBlock(this.#declarations)
    }

    /**
     * @param {string} value
     * @returns {string}
     * @see https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-csstext
     */
    set cssText(value) {
        this.#declarations.clear()
        this.#declared = []
        // TODO: remove CSSOM dependency
        let dummyRule
        try {
            dummyRule = CSSOM.parse(`#bogus{${value}}`).cssRules[0].style
        } catch (err) {
            // malformed css, just return
            return
        }
        const { length: ruleLength } = dummyRule
        for (let i = 0; i < ruleLength; ++i) {
            const property = dummyRule[i]
            this.setProperty(
                property,
                dummyRule.getPropertyValue(property),
                dummyRule.getPropertyPriority(property),
            )
        }
        this.#onChange(this.cssText)
    }

    /**
     * @returns {number}
     * @see https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-length
     */
    get length() {
        return this.#declared.length
    }

    /**
     * @param {string} property
     * @return {string}
     * @see https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-getpropertyvalue
     */
    getPropertyValue(property) {
        if (!property.startsWith('--')) {
            property = property.toLowerCase()
            if (shorthands.some(shorthand => shorthand === property)) {
                const list = []
                const { longhands } = properties.get(property)
                let prevPriority = null
                for (const longhand of longhands) {
                    const declaration = this.#declarations.get(longhand)
                    if (declaration) {
                        const [,, priority] = declaration
                        if (priority === prevPriority || prevPriority === null) {
                            prevPriority = priority
                            list.push(declaration)
                            continue
                        }
                    }
                    return ''
                }
                return serializeCSSValue(list)
            }
        }
        const declaration = this.#declarations.get(property)
        if (declaration) {
            return serializeCSSValue(...declaration)
        }
        return ''
    }

    /**
     * @param {string} property
     * @param {string} value
     * @param {string} [priority=""] "important" or ""
     * @see https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-setproperty
     */
    setProperty(property, value, priority = '') {
        if (!property.startsWith('--')) {
            property = property.toLowerCase()
            if (!supportedProperties.has(property)) {
                return
            }
        }
        if (value === '') {
            this.removeProperty(property)
            return
        }
        if (priority && priority.toLowerCase() !== 'important') {
            return
        }
        let updated = false
        priority = !!priority
        if (shorthands.some(shorthand => shorthand === property)) {
            const { longhands } = properties.get(property)
            value = parseCSSValue(value, property, longhands)
            if (value === null) {
                return
            }
            updated = longhands.reduce(
                (updated, longhand) =>
                    setCSSDeclaration(
                        [longhand, value[longhand], priority],
                        this.#declarations,
                        this.#declared)
                    || updated,
                updated)
        } else {
            value = parseCSSValue(value, property)
            if (value === null) {
                return
            }
            updated = setCSSDeclaration([property, value, priority], this.#declarations, this.#declared)
        }
        if (updated) {
            this.#onChange(this.cssText)
        }
    }

    /**
     * @param {string} property
     * @return {string}
     * @see https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-removeproperty
     */
    removeProperty(property) {
        if (!property.startsWith('--')) {
            property = property.toLowerCase()
        }
        const prevValue = this.getPropertyValue(property)
        if (shorthands.includes(property)) {
            const { longhands } = properties.get(property)
            longhands.forEach(longhand => {
                if (this.#declarations.get(longhand)) {
                    this.removeProperty(longhand)
                }
            })
        } else if (this.#declarations.get(property)) {
            this.#declarations.delete(property)
            const index = this.#declared.indexOf(property)
            this.#declared.splice(index, 1)
            this.#onChange(this.cssText)
        }

        return prevValue
    }

    /**
     * @param {string} property
     * @returns {string}
     * @see https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-getpropertypriority
     */
    getPropertyPriority(property) {
        if (!property.startsWith('--')) {
            property = property.toLowerCase()
            if (shorthands.some(shorthand => shorthand === property)) {
                const { longhands } = properties.get(property)
                if (longhands.every(longhand => this.getPropertyPriority(longhand) === 'important')) {
                    return 'important'
                }
            }
        }
        const declaration = this.#declarations.get(property)
        if (declaration) {
            const [,, priority] = declaration
            if (priority) {
                return 'important'
            }
        }
        return ''
    }

    /**
     * @param {number|string} index
     * @returns {string}
     * @see https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-item
     */
    item(index) {
        return this.#declared[index] ?? ''
    }

    [idlUtils.supportsPropertyIndex](index) {
        return index >= 0 && index < this.#declared.length
    }

    [idlUtils.supportedPropertyIndices]() {
        return this.#declared.keys()
    }
}
module.exports.implementation = CSSStyleDeclarationImpl

/**
 * @param {array} declaration
 * @param {Map} declarations
 * @param {array} declared
 * @returns {void}
 * @see https://drafts.csswg.org/cssom/#set-a-css-declaration
 */
function setCSSDeclaration(declaration, declarations, declared) {
    const [property, value, priority] = declaration
    const prevDeclaration = declarations.get(property)
    if (prevDeclaration) {
        const [, prevValue, prevPriority] = prevDeclaration
        if (prevValue === value && prevPriority === priority) {
            return false
        }
    } else {
        declared.push(property)
    }
    declarations.set(property, declaration)
    return true
}

function identity(value) {
    return value
}

const properties = new Map()
/**
 * @see https://drafts.csswg.org/cssom/#concept-shorthands-preferred-order
 *
 * TODO: handle sorting shorthands starting with "-".
 */
const shorthands = Array.from(implementedProperties)
    .reduce((all, property) => {
        // camelCased if prefixed, otherwise PascalCased
        const attribute = cssPropertyToIDLAttribute(property)
        const filename = attribute[0].toLowerCase() + attribute.slice(1)
        const {
            longhands,
            parse = identity,
            serialize = longhands ? serializeShorthand : identity,
        } = require(`./properties/${filename}.js`)
        properties.set(property, { longhands, parse, serialize })
        if (longhands) {
            all.push([property, longhands])
        }
        return all
    }, [])
    .sort(([, a], [, b]) => b.length - a.length)
    .map(([shorthand]) => shorthand)

/**
 * @param {string} value
 * @returns {string}
 * @see https://drafts.csswg.org/css-syntax-3/#input-preprocessing
 */
function preprocess(value) {
    return value
    .replace(/\r|\f|\r\n/g, '\\n')
    .replace(/[\u0000\uD800-\uDFFF]/, '�') // eslint-disable-line no-control-regex
    .trim()
}

/**
 * @param {string} value
 * @param {string} property
 * @param {[string]} longhands
 * @returns {string|object|null}
 * @see https://drafts.csswg.org/cssom/#parse-a-css-value
 *
 * TODO: conform to the specification.
 */
function parseCSSValue(value, property, longhands) {
    value = preprocess(value)
    const cssWideKeyword = parseKeyword(value)
    if (cssWideKeyword) {
        if (longhands) {
            return longhands.reduce(
                (all, property) => ({ ...all, [property]: cssWideKeyword }),
                {})
        }
        return cssWideKeyword
    }
    if (property.startsWith('--')) {
        return value
    }
    const parse = properties.get(property)?.parse ?? identity
    return parse(value)
}

/**
 * @param {string} property
 * @param {[string]} component
 * @returns {string}
 * @see https://drafts.csswg.org/cssom/#serialize-a-css-component-value
 *
 * TODO: conform to the specification.
 */
function serializeCSSComponentValue(property, component) {
    if (property.startsWith('--')) {
        return component
    }
    const serialize = properties.get(property)?.serialize ?? identity
    return serialize(component)
}

/**
 * @param {string|array} property or list of declarations
 * @param {string} value
 * @returns {string}
 * @see https://drafts.csswg.org/cssom/#serialize-a-css-value
 *
 * TODO: conform to the specification.
 */
function serializeCSSValue(property, value) {
    if (Array.isArray(property)) {
        const longhandProperties = []
        const values = []
        property.forEach(([property, value]) => {
            longhandProperties.push(property)
            values.push(value)
        })
        const shorthand = shorthands.find(shorthand => {
            const { longhands } = properties.get(shorthand)
            return longhands.length === longhandProperties.length
                && longhandProperties.every(property => longhands.includes(property))
        })
        if (shorthand) {
            return serializeCSSValue(shorthand, values)
        }
        return ''
    }
    return serializeCSSComponentValue(property, value)
}

/**
 * @param {string} property
 * @param {string} value
 * @param {boolean} priority
 * @returns {string}
 * @see https://drafts.csswg.org/cssom/#serialize-a-css-declaration
 */
function serializeCSSDeclaration(property, value, priority) {
    let s = `${property}: ${value}`
    if (priority) {
        s += ' !important'
    }
    return `${s};`
}

/**
 * @param {Map} declarations
 * @returns {string}
 * @see https://drafts.csswg.org/cssom/#serialize-a-css-declaration-block
 */
function serializeCSSDeclarationBlock(declarations) {
    const list = []
    const alreadySerialized = []

    declarationLoop: for (const [property, value, priority] of declarations.values()) {

        if (alreadySerialized.includes(property)) {
            continue declarationLoop
        }

        const shorthandsForProperty = []
        shorthands.forEach(shorthand => {
            if (properties.get(shorthand).longhands.includes(property)) {
                shorthandsForProperty.push([shorthand, properties.get(shorthand).longhands])
            }
        })

        shorthandLoop: for (const [shorthand, longhands] of shorthandsForProperty) {

            // All longhand declarations left that share this shorthand
            const longhandDeclarations = []
            declarations.forEach(declaration => {
                const [property] = declaration
                if (alreadySerialized.includes(property)) {
                    return
                }
                if (shorthandsForProperty.some(([, longhands]) => longhands.includes(property))) {
                    longhandDeclarations.push(declaration)
                }
            })

            // All longhands that map to shorthand should be present in longhand declarations
            if (!longhands.every(property => longhandDeclarations.some(([longhand]) => longhand === property))) {
                continue shorthandLoop
            }

            const priorities = []
            const currentLonghandDeclarations = []
            longhandDeclarations.forEach(declaration => {
                const [property,, priority] = declaration
                if (longhands.includes(property)) {
                    currentLonghandDeclarations.push(declaration)
                    priorities.push(priority)
                }
            })
            const priority = priorities.every(Boolean)

            // None or all longhand declarations for this shorthand should have the priority flag
            if (priorities.some(Boolean) && !priority) {
                continue shorthandLoop
            }

            const value = serializeCSSValue(currentLonghandDeclarations)

            if (value === '') {
                continue shorthandLoop
            }

            list.push(serializeCSSDeclaration(shorthand, value, priority))
            alreadySerialized.push(...longhands)
            continue declarationLoop
        }

        list.push(serializeCSSDeclaration(property, serializeCSSValue(property, value), priority))
        alreadySerialized.push(property)
    }
    return list.join(' ')
}
