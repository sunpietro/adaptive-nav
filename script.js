/* global AdaptiveNav */
(function (window, document) {
    'use strict';
    
    window.AdaptiveNav = function (params) {
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
            _showToggler = function () {
                nav.classList.add(CLASS_NAV_TOGGLER_ACTIVE);
                toggler.classList.remove(CLASS_HIDDEN);
            },
            _hideToggler = function () {
                nav.classList.remove(CLASS_NAV_TOGGLER_ACTIVE);
                toggler.classList.add(CLASS_HIDDEN);
            },
            _updateNav = function () {
                var baseListWidth = baseList.offsetWidth,
                    filteredNavWidths = [],
                    allElementsVisible = false;
                
                filteredNavWidths = calculatedNavWidths.filter(function (width) {
                    return width <= baseListWidth;
                });
                
                allElementsVisible = filteredNavWidths.length !== calculatedNavWidths.length;
                
                if (allElementsVisible) {
                    _showToggler();
                } else {
                    _hideToggler();
                }
                
                baseListItems.forEach(function (item, index) {
                    if (filteredNavWidths[index]) {
                        item.classList.remove(CLASS_HIDDEN);
                        copyListItems[index].classList.add(CLASS_HIDDEN);
                    } else {
                        item.classList.add(CLASS_HIDDEN);
                        copyListItems[index].classList.remove(CLASS_HIDDEN);
                    }
                });
            },
            _toggleSecondNav = function () {
                copyList.classList.toggle(CLASS_HIDDEN);
                toggler.classList.toggle(CLASS_TOGGLER_ACTIVE);
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
        
        calculatedNavWidths = baseListItems.map(function (item) {
            navWidth = navWidth + item.offsetWidth;
            
            return navWidth; 
        });
        
        _updateNav();
        
        window.addEventListener('resize', function () {        
            window.clearTimeout(resizeTimeout);
            
            resizeTimeout = window.setTimeout(_updateNav, TIMEOUT);
        });
        
        return {
            update: _updateNav
        };
    };
    
    new AdaptiveNav();
    
})(window, window.document);