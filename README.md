# adaptive-nav
JS plugin adding a functionality of adaptive navigation to any navigation menus on a site.

The plugin tries to fit menu items in a navigation container according to the viewport width.
To test it by yourself you can resize the browser window and have fun.

![AdaptiveNav in action](https://dl.dropboxusercontent.com/u/55990510/adaptive-nav.gif)

## How to use it?

The usage is simple. Just include the `adaptive-nav.js` script into your HTML code, the following way:

```html
<script src="src/js/adaptive-nav.js"></script>
```

And also, add the CSS file with basic styling:

```html
<link rel="stylesheet" href="src/css/adaptive-nav.css">
```

The basic HTML structure for the navigation nav is:

```html
<nav class="adaptive-nav">
    <ul class="adaptive-nav__list">
        <li class="adaptive-nav__list__item">Item 1</li>
        <li class="adaptive-nav__list__item">Item 2</li>
        <li class="adaptive-nav__list__item">Item 3</li>
        [...]
        <li class="adaptive-nav__list__item">Item n</li>
    </ul>
</nav>
```

Then you can run the script with the following code:

```html
<script>
    new AdaptiveNav();
</script>
```

## Advanced usage

If you have your own navigation structure you can customize the way the **AdaptiveNav** plugin works by setting custom properties.

### Properties

#### navSelector
It's a selector of the nav container. By default it's `.adaptive-nav`

#### navListSelector
It's a selector of the list with menu items. By default it's `.adaptive-nav__list`

#### navItemSelector
It's a selector of the list item. By default it's `.adaptive-nav__list__item`

#### Properties usage
You can pass the properties, listed above, as an configuration object when creating a new instance of **AdaptiveNav**.

```html
<script>
    var adaptiveNav = new AdaptiveNav({
        navSelector: '.nav-container',
        navListSelector: '.nav-list',
        navItemSelector: '.nav-item'
    });
</script>
```

### Methods
When you create a new instance of **AdaptiveNav** it returns an object with the following methods. In the example above, the object with methods is called `adaptiveNav`.

#### update
The method updates the nav items alignment on demand.
It takes no additional parameters.
You can use it the following way: `adaptiveNav.update();`