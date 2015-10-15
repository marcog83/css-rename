define(function () {
    var tokenize = function () {
        var Selector = {
            attrAliases: {
                'for': 'htmlFor'
            },
            shorthand: {
                //'(?:(?:[^\\)\\]\\s*>+~,]+)(?:-?[_a-z]+[-\\w]))+#(-?[_a-z]+[-\\w]*)': '[id=$1]',
                '\\#(-?[_a-z]+[-\\w]*)': '[id=$1]',
                '\\.(-?[_a-z]+[-\\w]*)': '[class~=$1]'
            }
        };
        var foundCache = [];
        var parentCache = [];
        var regexCache = {};
        var patterns = {
            tag: /^((?:-?[_a-z]+[\w-]*)|\*)/i,
            attributes: /^\[([a-z]+\w*)+([~\|\^\$\*!=]=?)?['"]?([^\]]*)['"]?\]*/i,
            pseudos: /^:([-\w]+)(?:\(['"]?(.+)['"]?\))*/i,
            combinator: /^\s*([>+~]|\s)\s*/
        };

        var fixAttributes = function (attr) {
            var aliases = Selector.attrAliases;
            attr = attr || [];
            for (var i = 0, len = attr.length; i < len; ++i) {
                if (aliases[attr[i][0]]) { // convert reserved words, etc
                    attr[i][0] = aliases[attr[i][0]];
                }
                if (!attr[i][1]) { // use exists operator
                    attr[i][1] = '';
                }
            }
            return attr;
        };
        var getRegExp = function (str, flags) {
            flags = flags || '';
            if (!regexCache[str + flags]) {
                regexCache[str + flags] = new RegExp(str, flags);
            }
            return regexCache[str + flags];
        };
        var replaceShorthand = function (selector) {
            var shorthand = Selector.shorthand;
            var attrs = selector.match(patterns.attributes); // pull attributes to avoid false pos on "." and "#"
            if (attrs) {
                selector = selector.replace(patterns.attributes, 'REPLACED_ATTRIBUTE');
            }
            for (var re in shorthand) {
                selector = selector.replace(getRegExp(re, 'gi'), shorthand[re]);
            }

            if (attrs) {
                for (var i = 0, len = attrs.length; i < len; ++i) {
                    selector = selector.replace('REPLACED_ATTRIBUTE', attrs[i]);
                }
            }
            return selector;
        };
        return function (selector) {
            var token = {},     // one token per simple selector (left selector holds combinator)
                tokens = [],    // array of tokens
                id,             // unique id for the simple selector (if found)
                found = false,  // whether or not any matches were found this pass
                match;          // the regex match

            selector = replaceShorthand(selector); // convert ID and CLASS shortcuts to attributes

            /*
             Search for selector patterns, store, and strip them from the selector string
             until no patterns match (invalid selector) or we run out of chars.

             Multiple attributes and pseudos are allowed, in any order.
             for example:
             'form:first-child[type=button]:not(button)[lang|=en]'
             */
            do {
                found = false; // reset after full pass
                for (var re in patterns) {
                    if (re != 'tag' && re != 'combinator') { // only one allowed
                        token[re] = token[re] || [];
                    }
                    if (match = patterns[re].exec(selector)) { // note assignment
                        found = true;
                        if (re != 'tag' && re != 'combinator') { // only one allowed
                            //token[re] = token[re] || [];

                            // capture ID for fast path to element
                            if (re === 'attributes' && match[1] === 'id') {
                                token.id = match[3];
                            }

                            token[re].push(match.slice(1));
                        } else { // single selector (tag, combinator)
                            token[re] = match[1];
                        }
                        selector = selector.replace(match[0], ''); // strip current match from selector
                        if (re === 'combinator' || !selector.length) { // next token or done
                            token.attributes = fixAttributes(token.attributes);
                            token.pseudos = token.pseudos || [];
                            token.tag = token.tag || '*';
                            tokens.push(token);

                            token = { // prep next token
                                previous: token
                            };
                        }
                    }
                }
            } while (found);

            return tokens;
        };
    }();
    return tokenize;
});