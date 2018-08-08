# slidify.JS
Would you like an easy way to make cool slideshows? Here you go!

1. Whenever you wanna display multiple images in a slideshow, and
2. whatever they are (University presentations; your summer photos; manga; artwork)...
...this library might suit your case.

# JS + CSS?
Yeah. In the world there exists pure CSS3 slideshows and they are cool too.

However, nowadays - JavaScript is enabled in almost every browser. And JS is a great tool to enchance both user and developer experience.

slidify.JS allows you, web developer, to make slideshows using JavaScript code by providing special parameters to ease your job. The default parameters (Optional, can be overriden) are at the bottom of this page.

# A quick example?
## Option 1
1. Fork this repository
2. Open `example/index.html` and change it according to your needs.

## Option 2
To include the slideshow in your page/project, follow these instructions:

1. In your `<head>` section, assuming CSS path is correct:
```html
<link rel="stylesheet" href="./css/slidify.css">
```

2. In your `<body>` section, insert your slideshow wherever you want:
```html
<div id="your_slideshow"></div>
```

3. And before `</body>` tag, assuming JS path is correct and you have `summer1.png`, `summer2.png` and `summer3.png` in `./images/` folder:
```html
<script src="./js/slidify.js"></script>
<script>
	slidify.init({
		id: 'your_slideshow',
		path: './images/',
		image_name: 'summer',
		image_type: 'png',
		pages: 3
	});
</script>
```

Done!

## Full parameters list
You can customize your slideshow with the parameters below. The recommendation is to use those JS parameters below without touching the code, but you can also change `slidify.css` and `slidify.js` according to your needs.

Here is the full list (with default parameters) extracted from `slidify.js`:
```javascript
    let settings = {
        id: 'slideshow1',   /* The DOM identifier <div id='slideshow1'></div> */
        path: './slides/',  /* The base path for your images */
        image_name: 'example',  /* The base image name */
        image_type: 'png',  /* The images extension */
        image_width: 'auto',    /* Determines how image fits in the container in width */
        image_height: 'auto',   /* Determines how image fits in the container in height */
        pages: 1,   /* The number of pages. 2 pages means you have 2 slides 'example1.png' and 'example2.png'. */
        delay: 5000,    /* The transition delay. */
        controls: true, /* Enable navigation controls (For example prev/next buttons). */
        thumbnails: true, /* Enable thumbnails. */
        thumbnail_type: 'circle', /* Select thumbnail style. */
        random: false,  /* If true, the first selected slide is randomly selected. */
        slideshow: true,  /* If true, this is a slideshow - transitions are enabled. */
        wrap: false, /* If true, container gets resized to the biggest image provided after DOM is loaded. */
        animationSpeed: '1s' /* The transition animation speed. */
    }
```