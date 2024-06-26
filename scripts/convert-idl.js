
const Transformer = require('webidl2js')
const { cssPropertyToIDLAttribute } = require('../lib/parsers.js')
const fs = require('fs')
const path = require('path')
const supportedProperties = require('../lib/supportedProperties.js')
const webkitProperties = require('../lib/webkitProperties.js')

const srcDir = path.resolve(__dirname, '../src')
const implDir = path.resolve(__dirname, '../lib')

/*
 * TODO: This should be natively supported by WebIDL2JS's Transformer
 * https://github.com/jsdom/webidl2js/issues/188
 */
const stream = fs.createWriteStream(path.resolve(__dirname, '../src/CSSStyleDeclaration-properties.webidl'))

stream.write(`// autogenerated by scripts/convert-idl.js - ${new Date().toISOString()}\n`)
stream.write('partial interface CSSStyleDeclaration {\n')
stream.write('\t// https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-camel_cased_attribute\n')
for (const property of supportedProperties) {
    const camelCasedAttribute = cssPropertyToIDLAttribute(property)
    stream.write(`\t[CEReactions,ReflectStyle="${property}"] attribute [LegacyNullToEmptyString] CSSOMString _${camelCasedAttribute};\n`)
}
stream.write('\t// https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-webkit_cased_attribute\n')
for (const property of webkitProperties) {
    const webkitCasedAttribute = cssPropertyToIDLAttribute(property, true)
    stream.write(`\t[CEReactions,ReflectStyle="${property}"] attribute [LegacyNullToEmptyString] CSSOMString _${webkitCasedAttribute};\n`)
}
stream.write('\t// https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-dashed_attribute\n')
for (const property of supportedProperties) {
    if (!property.includes('-')) continue
    stream.write(`\t[CEReactions,ReflectStyle="${property}"] attribute [LegacyNullToEmptyString] CSSOMString ${property};\n`)
}
stream.end('};\n') // semicolon is required by webidl2Js

const transformer = new Transformer({
    implSuffix: '-impl',
    // TODO: Add support for `[CEReactions]`
    processReflect(idl, implName) {
        const reflectStyle = idl.extAttrs.find(extAttr => extAttr.name === 'ReflectStyle')
        if (reflectStyle?.rhs?.type !== 'string') {
            throw new Error(`Internal error: Invalid [ReflectStyle] for attribute ${idl.name}`)
        }
        return {
            get: `return ${implName}.getPropertyValue(${reflectStyle.rhs.value});`,
            set: `${implName}.setProperty(${reflectStyle.rhs.value}, V);`,
        }
    },
})

stream.on('finish', () => {
    transformer.addSource(srcDir, implDir)
    transformer
        .generate(implDir)
        .catch(error => {
            throw error
        })
})
