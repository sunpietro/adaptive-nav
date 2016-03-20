/* global AdaptiveNav, define, self */
/**
 * AdaptiveNav - JS plugin to allow navigation menus to adapt to viewport width | v1.0.2
 * https://github.com/sunpietro/adaptive-nav
 *
 * Copyright 2016 Piotr Nalepa
 * http://blog.piotrnalepa.pl
 *
 * Released under the MIT license
 * https://github.com/sunpietro/adaptive-nav/blob/master/LICENSE
 *
 * Date: 2016-03-16T22:30Z
 */
;(function (f) {
    var moduleName = 'adaptiveNav',
        typeUndefined = 'undefined';

    // CommonJS
    if (typeof exports === 'object' && typeof module !== typeUndefined) {
        module.exports = f(require(moduleName));
    // RequireJS
    } else if (typeof define === 'function' && define.amd) {
        define([moduleName], f);
    // <script>
    } else {
        var g;

        if (typeof window !== typeUndefined) {
            g = window;
        } else if (typeof global !== typeUndefined) {
            g = global;
        } else if (typeof self !== typeUndefined) {
            g = self;
        } else {
            g = this;
        }
        g.AdaptiveNav = f(g.AdaptiveNav);
    }
})(function (AdaptiveNav) {
    AdaptiveNav = function (params) {
        var CLASS_HIDDEN = 'is-hidden',
            CLASS_NAV = 'adaptive-nav',
            CLASS_NAV_TOGGLER_ACTIVE = CLASS_NAV + '--has-toggler-active',
            CLASS_LIST_SECONDARY = CLASS_NAV + '__list--secondary',
            CLASS_LIST_SECONDARY_HIDDEN = CLASS_LIST_SECONDARY + '--hidden',
            CLASS_TOGGLER = CLASS_NAV + '__toggler',
            CLASS_TOGGLER_ACTIVE = CLASS_TOGGLER + '--active',
            SELECTOR_NAV = '.' + CLASS_NAV,
            SELECTOR_LIST = SELECTOR_NAV + '__list',
            SELECTOR_ITEM = SELECTOR_LIST + '__item',
            TOGGLER_WIDTH = 54,
            TIMEOUT_RESIZE = 10,
            TIMEOUT_TAP = 250,
            nav,
            baseList,
            copyList,
            baseListItems,
            copyListItems,
            resizeTimeout,
            paramKey,
            navWidth = 0,
            tapStartTime = 0,
            calculatedNavWidths = [],
            toggler = document.createElement('button'),
            finalParams = {
                navSelector: SELECTOR_NAV,
                navListSelector: SELECTOR_LIST,
                navItemSelector: SELECTOR_ITEM
            },
            /**
             * Shows the toggler
             *
             * @method _showToggler
             * @private
             */
            _showToggler = function () {
                nav.classList.add(CLASS_NAV_TOGGLER_ACTIVE);
                toggler.classList.remove(CLASS_HIDDEN);
            },
            /**
             * Hides the toggler
             *
             * @method _hideToggler
             * @private
             */
            _hideToggler = function () {
                nav.classList.remove(CLASS_NAV_TOGGLER_ACTIVE);
                toggler.classList.add(CLASS_HIDDEN);
            },
            /**
             * Updates nav state.
             * Checks whether menu items fit available space in the nav.
             * If they don't fit all then it displays the toggler button
             * and makes items visible in the secondary list.
             *
             * @method _updateNav
             * @private
             */
            _updateNav = function () {
                var baseListWidth = baseList.offsetWidth - TOGGLER_WIDTH,
                    filteredNavWidths = [],
                    allElementsVisible = false,
                    /**
                     * Toggles the visibility of items
                     * in the primary and secondary list.
                     *
                     * @method _toggleItemsState
                     * @private
                     * @param item {HTMLElement} list item HTML node
                     * @param index {Number} item index in a list
                     */
                    _toggleItemsState = function (item, index) {
                        if (filteredNavWidths[index]) {
                            item.classList.remove(CLASS_HIDDEN);
                            copyListItems[index].classList.add(CLASS_HIDDEN);
                        } else {
                            item.classList.add(CLASS_HIDDEN);
                            copyListItems[index].classList.remove(CLASS_HIDDEN);
                        }
                    };

                filteredNavWidths = calculatedNavWidths.filter(function (width) {
                    return width <= baseListWidth;
                });

                allElementsVisible = filteredNavWidths.length !== calculatedNavWidths.length;

                if (allElementsVisible) {
                    _showToggler();
                } else {
                    _hideToggler();
                }

                baseListItems.forEach(_toggleItemsState);
            },
            /**
             * Toggles the visibility of the secondary list.
             *
             * @method _toggleSecondaryNav
             * @private
             */
            _toggleSecondaryNav = function (event) {
                copyList.classList.toggle(CLASS_LIST_SECONDARY_HIDDEN);
                toggler.classList.toggle(CLASS_TOGGLER_ACTIVE);

                if (!copyList.classList.contains(CLASS_LIST_SECONDARY_HIDDEN)) {
                    document.addEventListener('click', _hideSecondaryNavOnClickOutside, false);
                }
            },
            /**
             * Gets an element based on filtered using a provided callback
             *
             * @method _getElement
             * @private
             * @param element {HTMLElement} the HTML node element
             * @param callback {Function} the comparison callback to find element
             * @return element {HTMLElement|undefined}
             */
            _getElement = function (element, callback) {
                var parent = element.parentNode;

                if (!parent) { return undefined; }
                if (callback(element)) { return element; }

                return callback(parent) ? parent : _getElement(parent, callback);
            },
            /**
             * The comparison callback finding the secondary list HTML element
             *
             * @method _isTagCallback
             * @private
             * @param element {HTMLElement} the HTML node element
             * @return {Boolean}
             */
            _isSecondaryListCallback = function (element) {
                return (element.classList && element.classList.contains(CLASS_LIST_SECONDARY));
            },
            /**
             * The comparison callback finding the toggler button HTML element
             *
             * @method _isTagCallback
             * @private
             * @param element {HTMLElement} the HTML node element
             * @return {Boolean}
             */
            _isTogglerCallback = function (element) {
                return (element.classList && element.classList.contains(CLASS_TOGGLER));
            },
            /**
             * Click outside event callback.
             * Hides the secondary nav when a user clicks outside the secondary list.
             *
             * @method _hideSecondaryNavOnClickOutside
             * @private
             * @param event {Object} event object
             */
            _hideSecondaryNavOnClickOutside = function (event) {
                var isSecondaryList = !!_getElement(event.target, _isSecondaryListCallback),
                    isTogglerButton = !!_getElement(event.target, _isTogglerCallback);

                if (!isSecondaryList && !isTogglerButton) {
                    _toggleSecondaryNav.apply(this, arguments);

                    document.removeEventListener('click', _hideSecondaryNavOnClickOutside);
                }
            },
            /**
             * Resize event callback.
             * Updates the nav state on window resize.
             *
             * @method _updateNavOnResize
             * @private
             */
            _updateNavOnResize = function () {
                window.clearTimeout(resizeTimeout);

                resizeTimeout = window.setTimeout(_updateNav, TIMEOUT_RESIZE);
            },
            /**
             * Calculates total list width when item is visible.
             *
             * @method _updateNavOnResize
             * @private
             * @param item {HTMLElement} list item HTML node
             * @return {Number} the list width up to given item node
             */
            _calculateListWidths = function (item) {
                navWidth = navWidth + item.offsetWidth;

                return navWidth;
            },
            /**
             * Touch start event callback.
             * Initializes tap on toggler.
             *
             * @method _tapStartToggleSecondaryNav
             * @private
             */
            _tapStartToggleSecondaryNav = function () {
                tapStartTime = Date.now();
            },
            /**
             * Touch end event callback.
             * Checks time difference between touch start and touch end events.
             * If time difference is less than a defined timeout,
             * then toggle the secondary list state.
             *
             * @method _tapEndToggleSecondaryNav
             * @private
             */
            _tapEndToggleSecondaryNav = function () {
                var timeDiff = Date.now() - tapStartTime;

                if (timeDiff > TIMEOUT_TAP) {
                    return;
                }

                _toggleSecondaryNav.apply(this, arguments);
            };

        for (paramKey in params) {
            if (params.hasOwnProperty(paramKey)) {
                finalParams[paramKey] = params[paramKey];
            }
        }

        nav = document.querySelector(finalParams.navSelector);
        baseList = nav.querySelector(finalParams.navListSelector);
        copyList = baseList.cloneNode(true);
        baseListItems = [].slice.call(baseList.querySelectorAll(finalParams.navItemSelector));
        copyListItems = [].slice.call(copyList.querySelectorAll(finalParams.navItemSelector));

        copyList.classList.add(CLASS_LIST_SECONDARY);
        copyList.classList.add(CLASS_LIST_SECONDARY_HIDDEN);
        toggler.classList.add(CLASS_TOGGLER);
        toggler.classList.add(CLASS_HIDDEN);

        nav.appendChild(copyList);
        nav.appendChild(toggler);

        if ('touchstart' in window) {
            toggler.addEventListener('touchstart', _tapStartToggleSecondaryNav, false);
            toggler.addEventListener('touchend', _tapEndToggleSecondaryNav, false);
        } else {
            toggler.addEventListener('click', _toggleSecondaryNav, false);
        }

        calculatedNavWidths = baseListItems.map(_calculateListWidths);

        _updateNav();

        window.addEventListener('resize', _updateNavOnResize, false);
        window.addEventListener('orientationchange', _updateNavOnResize, false);

        return {
            /**
             * Updates the nav state on demand.
             *
             * @method update
             * @public
             */
            update: function () {
                window.clearTimeout(resizeTimeout);

                _updateNav();
            }
        };
    };

    return AdaptiveNav;
});