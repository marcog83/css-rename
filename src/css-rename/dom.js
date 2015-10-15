define(function (require) {

    var tokenize = require("./tokenize");
    var cssr = require("./utils");

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
    return _dom;
});