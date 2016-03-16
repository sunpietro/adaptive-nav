/* global AdaptiveNav, define, self */
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
            CLASS_TOGGLER = CLASS_NAV + '__toggler',
            CLASS_TOGGLER_ACTIVE = CLASS_TOGGLER + '--active',
            SELECTOR_NAV = '.' + CLASS_NAV,
            SELECTOR_LIST = SELECTOR_NAV + '__list',
            SELECTOR_ITEM = SELECTOR_LIST + '__item',
            TIMEOUT = 10,
            nav,
            baseList,
            copyList,
            baseListItems,
            copyListItems,
            resizeTimeout,
            paramKey,
            navWidth = 0,
            calculatedNavWidths = [],
            togglerClickHandler = null,
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
                var baseListWidth = baseList.offsetWidth,
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
             * @method _toggleSecondNav
             * @private
             */
            _toggleSecondNav = function () {
                copyList.classList.toggle(CLASS_HIDDEN);
                toggler.classList.toggle(CLASS_TOGGLER_ACTIVE);
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
                
                resizeTimeout = window.setTimeout(_updateNav, TIMEOUT);
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
            
        copyList.classList.add(CLASS_HIDDEN);   
        copyList.classList.add(CLASS_LIST_SECONDARY);
        toggler.classList.add(CLASS_TOGGLER);
        toggler.classList.add(CLASS_HIDDEN);
        
        nav.appendChild(copyList);
        nav.appendChild(toggler);
        
        togglerClickHandler = toggler.addEventListener('click', _toggleSecondNav, false);
        calculatedNavWidths = baseListItems.map(_calculateListWidths);
        
        _updateNav();
        
        window.addEventListener('resize', _updateNavOnResize);
        
        return {
            update: _updateNav
        };
    };
    
    return AdaptiveNav;
});