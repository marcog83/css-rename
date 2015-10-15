/**
 * Created by mgobbi on 15/10/2015.
 */
define(function (require) {
    var cssr = require("./core");
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
    return cssr

});