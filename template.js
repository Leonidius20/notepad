'use strict'

/**
 * Creates an element from a template and returns a Document with this element
 * @param htmlTemplate a template in the form of an HTML string, with placeholders
 *        to fill. Placeholder format: ${parameter_name}
 * @param replacements a parameter - value dictionary (object) used to replace
 *        placeholders with real values
 * @returns {Document} a document with a resulting element
 */
function getTemplatedElement(htmlTemplate, replacements) {
    for (const replacement in replacements) {
        if (replacements.hasOwnProperty(replacement))
            htmlTemplate =
                htmlTemplate.replace('${' + replacement + "}", replacements[replacement]);
    }

    const parser = new DOMParser();
    return parser.parseFromString(htmlTemplate, 'text/html');
}