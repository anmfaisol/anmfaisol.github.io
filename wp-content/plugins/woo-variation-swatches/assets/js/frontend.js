/*!
 * WooCommerce Variation Swatches v1.0.36 
 * 
 * Author: Emran Ahmed ( emran.bd.08@gmail.com ) 
 * Date: 2018-9-6 21:20:20
 * Released under the GPLv3 license.
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ({

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

jQuery(function ($) {
    Promise.resolve().then(function () {
        return __webpack_require__(11);
    }).then(function () {
        // Init on Ajax Popup :)
        $(document).on('wc_variation_form', '.variations_form', function () {
            $(this).WooVariationSwatches();
        });

        // Support for Jetpack's Infinite Scroll,
        $(document.body).on('post-load', function () {
            $('.variations_form').each(function () {
                $(this).wc_variation_form();
            });
        });

        // Support for Yith Infinite Scroll
        $(document).on('yith_infs_added_elem', function () {
            $('.variations_form').each(function () {
                $(this).wc_variation_form();
            });
        });
    });
}); // end of jquery main wrapper

/***/ }),

/***/ 11:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ================================================================
// WooCommerce Variation Change
// ================================================================

var WooVariationSwatches = function ($) {

    var Default = {};

    var WooVariationSwatches = function () {
        function WooVariationSwatches(element, config) {
            _classCallCheck(this, WooVariationSwatches);

            // Assign
            this._element = $(element);
            this._config = $.extend({}, Default, config);
            this._generated = {};
            this._out_of_stock = {};
            this.product_variations = this._element.data('product_variations');
            this.is_ajax_variation = !this.product_variations;
            this.product_id = this._element.data('product_id');
            this.hidden_behaviour = $('body').hasClass('woo-variation-swatches-attribute-behavior-hide');
            this.is_mobile = $('body').hasClass('woo-variation-swatches-on-mobile');

            // Call
            this.init(this.is_ajax_variation, this.hidden_behaviour);
            this.loaded(this.is_ajax_variation, this.hidden_behaviour);
            this.update(this.is_ajax_variation, this.hidden_behaviour);
            this.reset(this.is_ajax_variation, this.hidden_behaviour);

            // Trigger
            $(document).trigger('woo_variation_swatches', [this._element]);
        }

        _createClass(WooVariationSwatches, [{
            key: 'init',
            value: function init(is_ajax, hidden_behaviour) {
                var _this3 = this;

                var _this = this;
                this._element.find('ul.variable-items-wrapper').each(function (i, el) {

                    var select = $(this).siblings('select.woo-variation-raw-select');
                    var li = $(this).find('li');
                    var reselect_clear = $(this).hasClass('reselect-clear');
                    var is_mobile = $('body').hasClass('woo-variation-swatches-on-mobile');

                    $(this).parent().addClass('woo-variation-items-wrapper');

                    // For Avada FIX
                    if (select.length < 1) {
                        select = $(this).parent().find('select.woo-variation-raw-select');
                    }

                    if (reselect_clear) {
                        $(this).on('touchstart click', 'li:not(.selected):not(.radio-variable-item)', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            var value = $(this).data('value');
                            select.val(value).trigger('change');
                            select.trigger('click');

                            select.trigger('focusin');

                            if (is_mobile) {
                                select.trigger('touchstart');
                            }

                            $(this).trigger('focus'); // Mobile tooltip
                            $(this).trigger('wvs-selected-item', [value, select, _this._element]); // Custom Event for li
                        });

                        $(this).on('touchstart click', 'li.selected:not(.radio-variable-item)', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            select.val('').trigger('change');
                            select.trigger('click');

                            select.trigger('focusin');

                            if (is_mobile) {
                                select.trigger('touchstart');
                            }

                            $(this).trigger('focus'); // Mobile tooltip

                            $(this).trigger('wvs-unselected-item', [value, select, _this._element]); // Custom Event for li
                        });

                        // RADIO
                        $(this).on('touchstart click', 'input.wvs-radio-variable-item:radio', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            $(this).trigger('change');
                        });

                        $(this).on('change', 'input.wvs-radio-variable-item:radio', function (e) {
                            var _this2 = this;

                            e.preventDefault();
                            e.stopPropagation();

                            var value = $(this).val();

                            if ($(this).parent('li.radio-variable-item').hasClass('selected')) {
                                select.val('').trigger('change');
                                _.delay(function () {
                                    $(_this2).prop('checked', false);
                                    $(_this2).parent('li.radio-variable-item').trigger('wvs-unselected-item', [value, select, _this._element]); // Custom Event for li
                                }, 1);
                            } else {
                                select.val(value).trigger('change');
                                $(this).parent('.radio-variable-item').trigger('wvs-selected-item', [value, select, _this._element]); // Custom Event for li
                            }

                            select.trigger('click');
                            select.trigger('focusin');
                            if (is_mobile) {
                                select.trigger('touchstart');
                            }
                        });
                    } else {
                        $(this).on('touchstart click', 'li:not(.radio-variable-item)', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            var value = $(this).data('value');
                            select.val(value).trigger('change');
                            select.trigger('click');
                            select.trigger('focusin');
                            if (is_mobile) {
                                select.trigger('touchstart');
                            }

                            $(this).trigger('focus'); // Mobile tooltip

                            $(this).trigger('wvs-selected-item', [value, select, _this._element]); // Custom Event for li
                        });

                        // Radio
                        $(this).on('change', 'input.wvs-radio-variable-item:radio', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            var value = $(this).val();

                            select.val(value).trigger('change');
                            select.trigger('click');
                            select.trigger('focusin');

                            if (is_mobile) {
                                select.trigger('touchstart');
                            }

                            // Radio
                            $(this).parent('li.radio-variable-item').removeClass('selected disabled').addClass('selected');
                            $(this).parent('li.radio-variable-item').trigger('wvs-selected-item', [value, select, _this._element]); // Custom Event for li
                        });
                    }
                });

                _.delay(function () {
                    _this3._element.trigger('woo_variation_swatches_init', [_this3, _this3.product_variations]);
                    $(document).trigger('woo_variation_swatches_loaded', [_this3._element, _this3.product_variations]);
                }, 2);
            }
        }, {
            key: 'loaded',
            value: function loaded(is_ajax, hidden_behaviour) {
                if (!is_ajax) {
                    this._element.on('woo_variation_swatches_init', function (event, object, product_variations) {

                        object._generated = product_variations.reduce(function (obj, variation) {

                            Object.keys(variation.attributes).map(function (attribute_name) {
                                if (!obj[attribute_name]) {
                                    obj[attribute_name] = [];
                                }

                                if (variation.attributes[attribute_name]) {
                                    obj[attribute_name].push(variation.attributes[attribute_name]);
                                }
                            });

                            return obj;
                        }, {});

                        object._out_of_stock = product_variations.reduce(function (obj, variation) {

                            Object.keys(variation.attributes).map(function (attribute_name) {
                                if (!obj[attribute_name]) {
                                    obj[attribute_name] = [];
                                }

                                if (variation.attributes[attribute_name] && !variation.is_in_stock) {
                                    obj[attribute_name].push(variation.attributes[attribute_name]);
                                }
                            });

                            return obj;
                        }, {});

                        // console.log(object._out_of_stock);

                        $(this).find('ul.variable-items-wrapper').each(function () {
                            var li = $(this).find('li');
                            var attribute = $(this).data('attribute_name');
                            var attribute_values = object._generated[attribute];
                            var out_of_stock_values = object._out_of_stock[attribute];

                            //console.log(out_of_stock_values)

                            li.each(function () {
                                var attribute_value = $(this).attr('data-value');

                                if (!_.isEmpty(attribute_values) && !attribute_values.includes(attribute_value)) {
                                    $(this).removeClass('selected');
                                    $(this).addClass('disabled');

                                    if ($(this).hasClass('radio-variable-item')) {
                                        $(this).find('input.wvs-radio-variable-item:radio').prop('disabled', true).prop('checked', false);
                                    }
                                }
                            });
                        });
                    });
                }
            }
        }, {
            key: 'reset',
            value: function reset(is_ajax, hidden_behaviour) {
                var _this = this;
                this._element.on('reset_data', function (event) {
                    $(this).find('ul.variable-items-wrapper').each(function () {
                        var li = $(this).find('li');
                        li.each(function () {
                            if (!is_ajax) {
                                $(this).removeClass('selected disabled');

                                if ($(this).hasClass('radio-variable-item')) {
                                    $(this).find('input.wvs-radio-variable-item:radio').prop('disabled', false).prop('checked', false);
                                }
                            } else {
                                if ($(this).hasClass('radio-variable-item')) {
                                    //    $(this).find('input.wvs-radio-variable-item:radio').prop('checked', false);
                                }
                            }

                            $(this).trigger('wvs-unselected-item', ['', '', _this._element]); // Custom Event for li
                        });
                    });
                });
            }
        }, {
            key: 'update',
            value: function update(is_ajax, hidden_behaviour) {

                this._element.on('__found_variation.wc-variation-form', function (event, variation) {
                    var _this4 = this;

                    _.delay(function () {
                        $(_this4).find('ul.variable-items-wrapper').each(function () {
                            var attribute_name = $(this).data('attribute_name');

                            $(this).find('li').each(function () {
                                var value = $(this).attr('data-value');

                                console.log(variation);

                                if (variation.attributes[attribute_name] === value && !variation.is_in_stock) {
                                    $(this).addClass('disabled');
                                }
                            });
                        });
                    }, 2);
                });

                this._element.on('woocommerce_variation_has_changed', function (event) {
                    if (is_ajax) {
                        $(this).find('ul.variable-items-wrapper').each(function () {
                            var _this5 = this;

                            var selected = '',
                                options = $(this).siblings('select.woo-variation-raw-select').find('option'),
                                current = $(this).siblings('select.woo-variation-raw-select').find('option:selected'),
                                eq = $(this).siblings('select.woo-variation-raw-select').find('option').eq(1),
                                li = $(this).find('li'),
                                selects = [];

                            // For Avada FIX
                            if (options.length < 1) {
                                options = $(this).parent().find('select.woo-variation-raw-select').find('option');
                                current = $(this).parent().find('select.woo-variation-raw-select').find('option:selected');
                                eq = $(this).parent().find('select.woo-variation-raw-select').find('option').eq(1);
                            }

                            options.each(function () {
                                if ($(this).val() !== '') {
                                    selects.push($(this).val());
                                    selected = current ? current.val() : eq.val();
                                }
                            });

                            _.delay(function () {
                                li.each(function () {
                                    var value = $(this).attr('data-value');
                                    $(this).removeClass('selected disabled');

                                    if (value === selected) {
                                        $(this).addClass('selected');
                                        if ($(this).hasClass('radio-variable-item')) {
                                            $(this).find('input.wvs-radio-variable-item:radio').prop('disabled', false).prop('checked', true);
                                        }
                                    }
                                });

                                // Items Updated
                                $(_this5).trigger('wvs-items-updated');
                            }, 1);
                        });
                    }
                });

                // WithOut Ajax Update
                this._element.on('woocommerce_update_variation_values', function (event) {
                    $(this).find('ul.variable-items-wrapper').each(function () {
                        var _this6 = this;

                        var selected = '',
                            options = $(this).siblings('select.woo-variation-raw-select').find('option'),
                            current = $(this).siblings('select.woo-variation-raw-select').find('option:selected'),
                            eq = $(this).siblings('select.woo-variation-raw-select').find('option').eq(1),
                            li = $(this).find('li'),
                            selects = [];

                        // For Avada FIX
                        if (options.length < 1) {
                            options = $(this).parent().find('select.woo-variation-raw-select').find('option');
                            current = $(this).parent().find('select.woo-variation-raw-select').find('option:selected');
                            eq = $(this).parent().find('select.woo-variation-raw-select').find('option').eq(1);
                        }

                        options.each(function () {
                            if ($(this).val() !== '') {
                                selects.push($(this).val());
                                selected = current ? current.val() : eq.val();
                            }
                        });

                        _.delay(function () {
                            li.each(function () {
                                var value = $(this).attr('data-value');
                                $(this).removeClass('selected disabled').addClass('disabled');

                                if (_.contains(selects, value)) {

                                    $(this).removeClass('disabled');

                                    $(this).find('input.wvs-radio-variable-item:radio').prop('disabled', false);

                                    if (value === selected) {

                                        $(this).addClass('selected');

                                        if ($(this).hasClass('radio-variable-item')) {
                                            $(this).find('input.wvs-radio-variable-item:radio').prop('checked', true);
                                        }
                                    }
                                } else {

                                    if ($(this).hasClass('radio-variable-item')) {
                                        $(this).find('input.wvs-radio-variable-item:radio').prop('disabled', true).prop('checked', false);
                                    }
                                }
                            });

                            // Items Updated
                            $(_this6).trigger('wvs-items-updated');
                        }, 1);
                    });
                });
            }
        }], [{
            key: '_jQueryInterface',
            value: function _jQueryInterface(config) {
                return this.each(function () {
                    new WooVariationSwatches(this, config);
                });
            }
        }]);

        return WooVariationSwatches;
    }();

    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $.fn['WooVariationSwatches'] = WooVariationSwatches._jQueryInterface;
    $.fn['WooVariationSwatches'].Constructor = WooVariationSwatches;
    $.fn['WooVariationSwatches'].noConflict = function () {
        $.fn['WooVariationSwatches'] = $.fn['WooVariationSwatches'];
        return WooVariationSwatches._jQueryInterface;
    };

    return WooVariationSwatches;
}(jQuery);

/* harmony default export */ __webpack_exports__["default"] = (WooVariationSwatches);

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(10);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRzL2pzL2Zyb250ZW5kLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDBlZDkwMTZjNzFkMDBjZTc5Y2M5Iiwid2VicGFjazovLy9zcmMvanMvZnJvbnRlbmQuanMiLCJ3ZWJwYWNrOi8vL3NyYy9qcy9Xb29WYXJpYXRpb25Td2F0Y2hlcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA5KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAwZWQ5MDE2YzcxZDAwY2U3OWNjOSIsImpRdWVyeSgkID0+IHtcbiAgICBpbXBvcnQoJy4vV29vVmFyaWF0aW9uU3dhdGNoZXMnKS50aGVuKCgpID0+IHtcbiAgICAgICAgLy8gSW5pdCBvbiBBamF4IFBvcHVwIDopXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCd3Y192YXJpYXRpb25fZm9ybScsICcudmFyaWF0aW9uc19mb3JtJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCh0aGlzKS5Xb29WYXJpYXRpb25Td2F0Y2hlcygpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBTdXBwb3J0IGZvciBKZXRwYWNrJ3MgSW5maW5pdGUgU2Nyb2xsLFxuICAgICAgICAkKGRvY3VtZW50LmJvZHkpLm9uKCdwb3N0LWxvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcudmFyaWF0aW9uc19mb3JtJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS53Y192YXJpYXRpb25fZm9ybSgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU3VwcG9ydCBmb3IgWWl0aCBJbmZpbml0ZSBTY3JvbGxcbiAgICAgICAgJChkb2N1bWVudCkub24oJ3lpdGhfaW5mc19hZGRlZF9lbGVtJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLnZhcmlhdGlvbnNfZm9ybScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQodGhpcykud2NfdmFyaWF0aW9uX2Zvcm0oKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG59KTsgIC8vIGVuZCBvZiBqcXVlcnkgbWFpbiB3cmFwcGVyXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9qcy9mcm9udGVuZC5qcyIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFdvb0NvbW1lcmNlIFZhcmlhdGlvbiBDaGFuZ2Vcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgV29vVmFyaWF0aW9uU3dhdGNoZXMgPSAoKCQpID0+IHtcblxuICAgIGNvbnN0IERlZmF1bHQgPSB7fTtcblxuICAgIGNsYXNzIFdvb1ZhcmlhdGlvblN3YXRjaGVzIHtcblxuICAgICAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBjb25maWcpIHtcblxuICAgICAgICAgICAgLy8gQXNzaWduXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50ICAgICAgICAgICA9ICQoZWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLl9jb25maWcgICAgICAgICAgICA9ICQuZXh0ZW5kKHt9LCBEZWZhdWx0LCBjb25maWcpO1xuICAgICAgICAgICAgdGhpcy5fZ2VuZXJhdGVkICAgICAgICAgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuX291dF9vZl9zdG9jayAgICAgID0ge307XG4gICAgICAgICAgICB0aGlzLnByb2R1Y3RfdmFyaWF0aW9ucyA9IHRoaXMuX2VsZW1lbnQuZGF0YSgncHJvZHVjdF92YXJpYXRpb25zJyk7XG4gICAgICAgICAgICB0aGlzLmlzX2FqYXhfdmFyaWF0aW9uICA9ICF0aGlzLnByb2R1Y3RfdmFyaWF0aW9ucztcbiAgICAgICAgICAgIHRoaXMucHJvZHVjdF9pZCAgICAgICAgID0gdGhpcy5fZWxlbWVudC5kYXRhKCdwcm9kdWN0X2lkJyk7XG4gICAgICAgICAgICB0aGlzLmhpZGRlbl9iZWhhdmlvdXIgICA9ICQoJ2JvZHknKS5oYXNDbGFzcygnd29vLXZhcmlhdGlvbi1zd2F0Y2hlcy1hdHRyaWJ1dGUtYmVoYXZpb3ItaGlkZScpO1xuICAgICAgICAgICAgdGhpcy5pc19tb2JpbGUgICAgICAgICAgPSAkKCdib2R5JykuaGFzQ2xhc3MoJ3dvby12YXJpYXRpb24tc3dhdGNoZXMtb24tbW9iaWxlJyk7XG5cbiAgICAgICAgICAgIC8vIENhbGxcbiAgICAgICAgICAgIHRoaXMuaW5pdCh0aGlzLmlzX2FqYXhfdmFyaWF0aW9uLCB0aGlzLmhpZGRlbl9iZWhhdmlvdXIpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZWQodGhpcy5pc19hamF4X3ZhcmlhdGlvbiwgdGhpcy5oaWRkZW5fYmVoYXZpb3VyKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMuaXNfYWpheF92YXJpYXRpb24sIHRoaXMuaGlkZGVuX2JlaGF2aW91cik7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KHRoaXMuaXNfYWpheF92YXJpYXRpb24sIHRoaXMuaGlkZGVuX2JlaGF2aW91cik7XG5cbiAgICAgICAgICAgIC8vIFRyaWdnZXJcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLnRyaWdnZXIoJ3dvb192YXJpYXRpb25fc3dhdGNoZXMnLCBbdGhpcy5fZWxlbWVudF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIF9qUXVlcnlJbnRlcmZhY2UoY29uZmlnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBuZXcgV29vVmFyaWF0aW9uU3dhdGNoZXModGhpcywgY29uZmlnKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXQoaXNfYWpheCwgaGlkZGVuX2JlaGF2aW91cikge1xuXG4gICAgICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5maW5kKCd1bC52YXJpYWJsZS1pdGVtcy13cmFwcGVyJykuZWFjaChmdW5jdGlvbiAoaSwgZWwpIHtcblxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3QgICAgICAgICA9ICQodGhpcykuc2libGluZ3MoJ3NlbGVjdC53b28tdmFyaWF0aW9uLXJhdy1zZWxlY3QnKTtcbiAgICAgICAgICAgICAgICBsZXQgbGkgICAgICAgICAgICAgPSAkKHRoaXMpLmZpbmQoJ2xpJyk7XG4gICAgICAgICAgICAgICAgbGV0IHJlc2VsZWN0X2NsZWFyID0gJCh0aGlzKS5oYXNDbGFzcygncmVzZWxlY3QtY2xlYXInKTtcbiAgICAgICAgICAgICAgICBsZXQgaXNfbW9iaWxlICAgICAgPSAkKCdib2R5JykuaGFzQ2xhc3MoJ3dvby12YXJpYXRpb24tc3dhdGNoZXMtb24tbW9iaWxlJyk7XG5cbiAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmFkZENsYXNzKCd3b28tdmFyaWF0aW9uLWl0ZW1zLXdyYXBwZXInKTtcblxuICAgICAgICAgICAgICAgIC8vIEZvciBBdmFkYSBGSVhcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0Lmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ID0gJCh0aGlzKS5wYXJlbnQoKS5maW5kKCdzZWxlY3Qud29vLXZhcmlhdGlvbi1yYXctc2VsZWN0Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlc2VsZWN0X2NsZWFyKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykub24oJ3RvdWNoc3RhcnQgY2xpY2snLCAnbGk6bm90KC5zZWxlY3RlZCk6bm90KC5yYWRpby12YXJpYWJsZS1pdGVtKScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gJCh0aGlzKS5kYXRhKCd2YWx1ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnZhbCh2YWx1ZSkudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcignY2xpY2snKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnRyaWdnZXIoJ2ZvY3VzaW4nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzX21vYmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC50cmlnZ2VyKCd0b3VjaHN0YXJ0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykudHJpZ2dlcignZm9jdXMnKTsgLy8gTW9iaWxlIHRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykudHJpZ2dlcignd3ZzLXNlbGVjdGVkLWl0ZW0nLCBbdmFsdWUsIHNlbGVjdCwgX3RoaXMuX2VsZW1lbnRdKTsgLy8gQ3VzdG9tIEV2ZW50IGZvciBsaVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLm9uKCd0b3VjaHN0YXJ0IGNsaWNrJywgJ2xpLnNlbGVjdGVkOm5vdCgucmFkaW8tdmFyaWFibGUtaXRlbSknLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC52YWwoJycpLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnRyaWdnZXIoJ2NsaWNrJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC50cmlnZ2VyKCdmb2N1c2luJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc19tb2JpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcigndG91Y2hzdGFydCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnRyaWdnZXIoJ2ZvY3VzJyk7IC8vIE1vYmlsZSB0b29sdGlwXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykudHJpZ2dlcignd3ZzLXVuc2VsZWN0ZWQtaXRlbScsIFt2YWx1ZSwgc2VsZWN0LCBfdGhpcy5fZWxlbWVudF0pOyAvLyBDdXN0b20gRXZlbnQgZm9yIGxpXG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUkFESU9cbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5vbigndG91Y2hzdGFydCBjbGljaycsICdpbnB1dC53dnMtcmFkaW8tdmFyaWFibGUtaXRlbTpyYWRpbycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5vbignY2hhbmdlJywgJ2lucHV0Lnd2cy1yYWRpby12YXJpYWJsZS1pdGVtOnJhZGlvJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9ICQodGhpcykudmFsKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnBhcmVudCgnbGkucmFkaW8tdmFyaWFibGUtaXRlbScpLmhhc0NsYXNzKCdzZWxlY3RlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnZhbCgnJykudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5kZWxheSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoJ2xpLnJhZGlvLXZhcmlhYmxlLWl0ZW0nKS50cmlnZ2VyKCd3dnMtdW5zZWxlY3RlZC1pdGVtJywgW3ZhbHVlLCBzZWxlY3QsIF90aGlzLl9lbGVtZW50XSk7IC8vIEN1c3RvbSBFdmVudCBmb3IgbGlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnZhbCh2YWx1ZSkudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoJy5yYWRpby12YXJpYWJsZS1pdGVtJykudHJpZ2dlcignd3ZzLXNlbGVjdGVkLWl0ZW0nLCBbdmFsdWUsIHNlbGVjdCwgX3RoaXMuX2VsZW1lbnRdKTsgLy8gQ3VzdG9tIEV2ZW50IGZvciBsaVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC50cmlnZ2VyKCdmb2N1c2luJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNfbW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnRyaWdnZXIoJ3RvdWNoc3RhcnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLm9uKCd0b3VjaHN0YXJ0IGNsaWNrJywgJ2xpOm5vdCgucmFkaW8tdmFyaWFibGUtaXRlbSknLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9ICQodGhpcykuZGF0YSgndmFsdWUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC52YWwodmFsdWUpLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcignZm9jdXNpbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzX21vYmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC50cmlnZ2VyKCd0b3VjaHN0YXJ0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykudHJpZ2dlcignZm9jdXMnKTsgLy8gTW9iaWxlIHRvb2x0aXBcblxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS50cmlnZ2VyKCd3dnMtc2VsZWN0ZWQtaXRlbScsIFt2YWx1ZSwgc2VsZWN0LCBfdGhpcy5fZWxlbWVudF0pOyAvLyBDdXN0b20gRXZlbnQgZm9yIGxpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJhZGlvXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykub24oJ2NoYW5nZScsICdpbnB1dC53dnMtcmFkaW8tdmFyaWFibGUtaXRlbTpyYWRpbycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gJCh0aGlzKS52YWwoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnZhbCh2YWx1ZSkudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC50cmlnZ2VyKCdmb2N1c2luJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc19tb2JpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcigndG91Y2hzdGFydCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSYWRpb1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoJ2xpLnJhZGlvLXZhcmlhYmxlLWl0ZW0nKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQgZGlzYWJsZWQnKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCdsaS5yYWRpby12YXJpYWJsZS1pdGVtJykudHJpZ2dlcignd3ZzLXNlbGVjdGVkLWl0ZW0nLCBbdmFsdWUsIHNlbGVjdCwgX3RoaXMuX2VsZW1lbnRdKTsgLy8gQ3VzdG9tIEV2ZW50IGZvciBsaVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgXy5kZWxheSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC50cmlnZ2VyKCd3b29fdmFyaWF0aW9uX3N3YXRjaGVzX2luaXQnLCBbdGhpcywgdGhpcy5wcm9kdWN0X3ZhcmlhdGlvbnNdKVxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQpLnRyaWdnZXIoJ3dvb192YXJpYXRpb25fc3dhdGNoZXNfbG9hZGVkJywgW3RoaXMuX2VsZW1lbnQsIHRoaXMucHJvZHVjdF92YXJpYXRpb25zXSlcbiAgICAgICAgICAgIH0sIDIpXG4gICAgICAgIH1cblxuICAgICAgICBsb2FkZWQoaXNfYWpheCwgaGlkZGVuX2JlaGF2aW91cikge1xuICAgICAgICAgICAgaWYgKCFpc19hamF4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5vbignd29vX3ZhcmlhdGlvbl9zd2F0Y2hlc19pbml0JywgZnVuY3Rpb24gKGV2ZW50LCBvYmplY3QsIHByb2R1Y3RfdmFyaWF0aW9ucykge1xuXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5fZ2VuZXJhdGVkID0gcHJvZHVjdF92YXJpYXRpb25zLnJlZHVjZSgob2JqLCB2YXJpYXRpb24pID0+IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXModmFyaWF0aW9uLmF0dHJpYnV0ZXMpLm1hcCgoYXR0cmlidXRlX25hbWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW9ialthdHRyaWJ1dGVfbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW2F0dHJpYnV0ZV9uYW1lXSA9IFtdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhcmlhdGlvbi5hdHRyaWJ1dGVzW2F0dHJpYnV0ZV9uYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbYXR0cmlidXRlX25hbWVdLnB1c2godmFyaWF0aW9uLmF0dHJpYnV0ZXNbYXR0cmlidXRlX25hbWVdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcblxuICAgICAgICAgICAgICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0Ll9vdXRfb2Zfc3RvY2sgPSBwcm9kdWN0X3ZhcmlhdGlvbnMucmVkdWNlKChvYmosIHZhcmlhdGlvbikgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyh2YXJpYXRpb24uYXR0cmlidXRlcykubWFwKChhdHRyaWJ1dGVfbmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb2JqW2F0dHJpYnV0ZV9uYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbYXR0cmlidXRlX25hbWVdID0gW11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFyaWF0aW9uLmF0dHJpYnV0ZXNbYXR0cmlidXRlX25hbWVdICYmICF2YXJpYXRpb24uaXNfaW5fc3RvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqW2F0dHJpYnV0ZV9uYW1lXS5wdXNoKHZhcmlhdGlvbi5hdHRyaWJ1dGVzW2F0dHJpYnV0ZV9uYW1lXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XG5cbiAgICAgICAgICAgICAgICAgICAgfSwge30pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG9iamVjdC5fb3V0X29mX3N0b2NrKTtcblxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ3VsLnZhcmlhYmxlLWl0ZW1zLXdyYXBwZXInKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsaSAgICAgICAgICAgICAgICAgID0gJCh0aGlzKS5maW5kKCdsaScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZSAgICAgICAgICAgPSAkKHRoaXMpLmRhdGEoJ2F0dHJpYnV0ZV9uYW1lJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXR0cmlidXRlX3ZhbHVlcyAgICA9IG9iamVjdC5fZ2VuZXJhdGVkW2F0dHJpYnV0ZV07XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgb3V0X29mX3N0b2NrX3ZhbHVlcyA9IG9iamVjdC5fb3V0X29mX3N0b2NrW2F0dHJpYnV0ZV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cob3V0X29mX3N0b2NrX3ZhbHVlcylcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF0dHJpYnV0ZV92YWx1ZSA9ICQodGhpcykuYXR0cignZGF0YS12YWx1ZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFfLmlzRW1wdHkoYXR0cmlidXRlX3ZhbHVlcykgJiYgIWF0dHJpYnV0ZV92YWx1ZXMuaW5jbHVkZXMoYXR0cmlidXRlX3ZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdyYWRpby12YXJpYWJsZS1pdGVtJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnaW5wdXQud3ZzLXJhZGlvLXZhcmlhYmxlLWl0ZW06cmFkaW8nKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXNldChpc19hamF4LCBoaWRkZW5fYmVoYXZpb3VyKSB7XG4gICAgICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5vbigncmVzZXRfZGF0YScsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgndWwudmFyaWFibGUtaXRlbXMtd3JhcHBlcicpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbGkgPSAkKHRoaXMpLmZpbmQoJ2xpJyk7XG4gICAgICAgICAgICAgICAgICAgIGxpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc19hamF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQgZGlzYWJsZWQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdyYWRpby12YXJpYWJsZS1pdGVtJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCdpbnB1dC53dnMtcmFkaW8tdmFyaWFibGUtaXRlbTpyYWRpbycpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ3JhZGlvLXZhcmlhYmxlLWl0ZW0nKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAkKHRoaXMpLmZpbmQoJ2lucHV0Lnd2cy1yYWRpby12YXJpYWJsZS1pdGVtOnJhZGlvJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykudHJpZ2dlcignd3ZzLXVuc2VsZWN0ZWQtaXRlbScsIFsnJywgJycsIF90aGlzLl9lbGVtZW50XSk7IC8vIEN1c3RvbSBFdmVudCBmb3IgbGlcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZShpc19hamF4LCBoaWRkZW5fYmVoYXZpb3VyKSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQub24oJ19fZm91bmRfdmFyaWF0aW9uLndjLXZhcmlhdGlvbi1mb3JtJywgZnVuY3Rpb24gKGV2ZW50LCB2YXJpYXRpb24pIHtcblxuICAgICAgICAgICAgICAgIF8uZGVsYXkoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ3VsLnZhcmlhYmxlLWl0ZW1zLXdyYXBwZXInKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhdHRyaWJ1dGVfbmFtZSA9ICQodGhpcykuZGF0YSgnYXR0cmlidXRlX25hbWUnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCdsaScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9ICQodGhpcykuYXR0cignZGF0YS12YWx1ZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codmFyaWF0aW9uKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhcmlhdGlvbi5hdHRyaWJ1dGVzW2F0dHJpYnV0ZV9uYW1lXSA9PT0gdmFsdWUgJiYgIXZhcmlhdGlvbi5pc19pbl9zdG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSwgMilcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50Lm9uKCd3b29jb21tZXJjZV92YXJpYXRpb25faGFzX2NoYW5nZWQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNfYWpheCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ3VsLnZhcmlhYmxlLWl0ZW1zLXdyYXBwZXInKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZCA9ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgID0gJCh0aGlzKS5zaWJsaW5ncygnc2VsZWN0Lndvby12YXJpYXRpb24tcmF3LXNlbGVjdCcpLmZpbmQoJ29wdGlvbicpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgID0gJCh0aGlzKS5zaWJsaW5ncygnc2VsZWN0Lndvby12YXJpYXRpb24tcmF3LXNlbGVjdCcpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVxICAgICAgID0gJCh0aGlzKS5zaWJsaW5ncygnc2VsZWN0Lndvby12YXJpYXRpb24tcmF3LXNlbGVjdCcpLmZpbmQoJ29wdGlvbicpLmVxKDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpICAgICAgID0gJCh0aGlzKS5maW5kKCdsaScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdHMgID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvciBBdmFkYSBGSVhcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zID0gJCh0aGlzKS5wYXJlbnQoKS5maW5kKCdzZWxlY3Qud29vLXZhcmlhdGlvbi1yYXctc2VsZWN0JykuZmluZCgnb3B0aW9uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9ICQodGhpcykucGFyZW50KCkuZmluZCgnc2VsZWN0Lndvby12YXJpYXRpb24tcmF3LXNlbGVjdCcpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVxICAgICAgPSAkKHRoaXMpLnBhcmVudCgpLmZpbmQoJ3NlbGVjdC53b28tdmFyaWF0aW9uLXJhdy1zZWxlY3QnKS5maW5kKCdvcHRpb24nKS5lcSgxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS52YWwoKSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0cy5wdXNoKCQodGhpcykudmFsKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZCA9IGN1cnJlbnQgPyBjdXJyZW50LnZhbCgpIDogZXEudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZGVsYXkoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtdmFsdWUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQgZGlzYWJsZWQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ3JhZGlvLXZhcmlhYmxlLWl0ZW0nKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnaW5wdXQud3ZzLXJhZGlvLXZhcmlhYmxlLWl0ZW06cmFkaW8nKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEl0ZW1zIFVwZGF0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnRyaWdnZXIoJ3d2cy1pdGVtcy11cGRhdGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFdpdGhPdXQgQWpheCBVcGRhdGVcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQub24oJ3dvb2NvbW1lcmNlX3VwZGF0ZV92YXJpYXRpb25fdmFsdWVzJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCd1bC52YXJpYWJsZS1pdGVtcy13cmFwcGVyJykuZWFjaChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zICA9ICQodGhpcykuc2libGluZ3MoJ3NlbGVjdC53b28tdmFyaWF0aW9uLXJhdy1zZWxlY3QnKS5maW5kKCdvcHRpb24nKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgID0gJCh0aGlzKS5zaWJsaW5ncygnc2VsZWN0Lndvby12YXJpYXRpb24tcmF3LXNlbGVjdCcpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXEgICAgICAgPSAkKHRoaXMpLnNpYmxpbmdzKCdzZWxlY3Qud29vLXZhcmlhdGlvbi1yYXctc2VsZWN0JykuZmluZCgnb3B0aW9uJykuZXEoMSksXG4gICAgICAgICAgICAgICAgICAgICAgICBsaSAgICAgICA9ICQodGhpcykuZmluZCgnbGknKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdHMgID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRm9yIEF2YWRhIEZJWFxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zID0gJCh0aGlzKS5wYXJlbnQoKS5maW5kKCdzZWxlY3Qud29vLXZhcmlhdGlvbi1yYXctc2VsZWN0JykuZmluZCgnb3B0aW9uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50ID0gJCh0aGlzKS5wYXJlbnQoKS5maW5kKCdzZWxlY3Qud29vLXZhcmlhdGlvbi1yYXctc2VsZWN0JykuZmluZCgnb3B0aW9uOnNlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcSAgICAgID0gJCh0aGlzKS5wYXJlbnQoKS5maW5kKCdzZWxlY3Qud29vLXZhcmlhdGlvbi1yYXctc2VsZWN0JykuZmluZCgnb3B0aW9uJykuZXEoMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykudmFsKCkgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0cy5wdXNoKCQodGhpcykudmFsKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkID0gY3VycmVudCA/IGN1cnJlbnQudmFsKCkgOiBlcS52YWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgXy5kZWxheSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtdmFsdWUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCBkaXNhYmxlZCcpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF8uY29udGFpbnMoc2VsZWN0cywgdmFsdWUpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ2lucHV0Lnd2cy1yYWRpby12YXJpYWJsZS1pdGVtOnJhZGlvJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSBzZWxlY3RlZCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygncmFkaW8tdmFyaWFibGUtaXRlbScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCdpbnB1dC53dnMtcmFkaW8tdmFyaWFibGUtaXRlbTpyYWRpbycpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygncmFkaW8tdmFyaWFibGUtaXRlbScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ2lucHV0Lnd2cy1yYWRpby12YXJpYWJsZS1pdGVtOnJhZGlvJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEl0ZW1zIFVwZGF0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykudHJpZ2dlcignd3ZzLWl0ZW1zLXVwZGF0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICogalF1ZXJ5XG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICovXG5cbiAgICAkLmZuWydXb29WYXJpYXRpb25Td2F0Y2hlcyddID0gV29vVmFyaWF0aW9uU3dhdGNoZXMuX2pRdWVyeUludGVyZmFjZTtcbiAgICAkLmZuWydXb29WYXJpYXRpb25Td2F0Y2hlcyddLkNvbnN0cnVjdG9yID0gV29vVmFyaWF0aW9uU3dhdGNoZXM7XG4gICAgJC5mblsnV29vVmFyaWF0aW9uU3dhdGNoZXMnXS5ub0NvbmZsaWN0ICA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJC5mblsnV29vVmFyaWF0aW9uU3dhdGNoZXMnXSA9ICQuZm5bJ1dvb1ZhcmlhdGlvblN3YXRjaGVzJ107XG4gICAgICAgIHJldHVybiBXb29WYXJpYXRpb25Td2F0Y2hlcy5falF1ZXJ5SW50ZXJmYWNlXG4gICAgfVxuXG4gICAgcmV0dXJuIFdvb1ZhcmlhdGlvblN3YXRjaGVzO1xuXG59KShqUXVlcnkpO1xuXG5leHBvcnQgZGVmYXVsdCBXb29WYXJpYXRpb25Td2F0Y2hlc1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvanMvV29vVmFyaWF0aW9uU3dhdGNoZXMuanMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUM3REE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQU1BO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTVCQTtBQUFBO0FBQUE7QUFtQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFsS0E7QUFBQTtBQUFBO0FBcUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFqT0E7QUFBQTtBQUFBO0FBb09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBMVBBO0FBQUE7QUFBQTtBQUNBO0FBNlBBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUExWEE7QUFBQTtBQUFBO0FBOEJBO0FBQ0E7QUFDQTtBQUNBO0FBakNBO0FBQ0E7QUFEQTtBQUFBO0FBQ0E7QUE0WEE7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBIiwic291cmNlUm9vdCI6IiJ9