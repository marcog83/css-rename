(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define("cssr",factory);
	} else {
		root.cssr = factory();
	}
}(this, function () {
	'use strict';
/**
 * Created by mgobbi on 15/10/2015.
 */

    var cssr = {
        CLASSES_MAP: {}
    };
    

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
    
/**
 * Created by mgobbi on 15/10/2015.
 */

    
    cssr.utils = {
        compose: function () {
            var fns = arguments;
            return function (result) {
                for (var i = fns.length - 1; i > -1; i--) {
                    result = fns[i].call(this, result);
                }

                return result;
            };
        },
        once: function (fn) {
            var called = false, result;
            return function () {
                if (called) {
                    return result;
                }
                called = true;
                result = fn.apply(this, arguments);
                return result;
            };
        }
    };
    


    
    

    var _dom = (function dom() {
        var pseudos = {


            'nth-child': function (attr) {
                return ":" + attr[0];
            },

            'nth-last-child': function (attr) {
                return ":" + attr[0];
            },

            'nth-of-type': function (attr) {
                return ":" + attr[0];
            },

            'nth-last-of-type': function (attr) {
                return ":" + attr[0];
            },

            'first-child': function (attr) {
                return ":" + attr[0];
            },

            'last-child': function (attr) {
                return ":" + attr[0];
            },

            'first-of-type': function (attr) {
                return ":" + attr[0];
            },

            'last-of-type': function (attr) {
                return ":" + attr[0];
            },

            'only-child': function (attr) {
                return ":" + attr[0];
            },

            'only-of-type': function (attr) {
                return ":" + attr[0];
            },

            'empty': function (attr) {
                return ":" + attr[0];
            },

            'not': function (attr) {
                return ":not(" + attr[1] + ")";
            },


            'checked': function (node) {
                return ':checked';
            }
        };
        var starter = {
            id: function (attr) {
                var new_selector = cssr.CLASSES_MAP[attr[2]] || attr[2];
                return "#" + new_selector;
            },
            "class": function (attr) {
                var new_selector = cssr.CLASSES_MAP[attr[2]] || attr[2];
                return "." + new_selector;
            },
            attributes: function (attr) {
                return "[" + attr.join("") + "]";
            }
        };

        function getCssName(selector) {
            return tokenize(selector).map(function (item) {
                var attributes = item.attributes || [];
                var _pseudos = item.pseudos || [];
                var result = attributes.reduce(function (prev, attr) {
                        var fn = starter[attr[0]] || starter.attributes;
                        return prev + fn(attr);
                    }, item.tag=="*"?"":item.tag);
                result = _pseudos.reduce(function (prev, pseudo) {
                    var fn = pseudos[pseudo[0]];
                    return prev + fn(pseudo);
                }, result);
                var combinator = item.combinator ? (item.combinator != " " ? " " + item.combinator + " " : " ") : "";
                return result + combinator;

            }).join("");
        }


        return {
            getCssName: getCssName,
            querySelector: function (selector, node) {
                return node.querySelector(getCssName(selector));
            },
            querySelectorAll: function (selector, node) {
                return node.querySelectorAll(getCssName(selector));
            },
            getElementById: function (selector, node) {
                return node.getElementById(getCssName(selector));
            },
            getElementsByClassName: function (selector, node) {
                return node.getElementsByClassName(getCssName(selector));
            }
        }
    })();
    
/**
 * Created by mgobbi on 15/10/2015.
 */

    
    
    cssr.dom = _dom;


;





return cssr;
}));