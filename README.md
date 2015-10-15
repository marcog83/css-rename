# css-rename
a tool that allow you to rename css selector in your css files, html and javascript, in order to save some bytes in production

#Usage
As far as HTML and CSS minification, I use [yiminghe class-id-minifier](https://github.com/yiminghe/class-id-minifier) grunt module.
It also creates a JS Object which maps extended selectors and minified ones.
On top of this map, css-rename is able to convert selectors.

let's say you have this original HTML markup

```html
<div class="content-CTR">
    <div class="content-CNT">1</div>
</div>
<div class="content-CTR">
    <div class="content-CNT">2</div>
</div>
```

that after the minification becomes

```html
<div class="a">
    <div class="b">1</div>
</div>
<div class="a">
    <div class="b">2</div>
</div>
```

in your javascript you need to query DOM. Well you can do it with original selectors and css-rename takes care of converting your query

```javascript
 var nodes = cssr.dom.querySelectorAll(".content-CTR > .content-CNT", document.body); // [div.b, div.b]
```

If you need just the query, not the DOM element, you can use getCssName function. For example to use it with jQuery

```javascript
 var query = cssr.dom.getCssName(".content-CTR > .content-CNT");//.a > .b

 $(query).doSomething();
```