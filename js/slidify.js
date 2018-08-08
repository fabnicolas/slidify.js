var DOMUtils = (function(){
    let setVendor=function(element, attribute, value){
        element.style["webkit" + attribute] = value + ' ease-in-out';
        element.style["Moz" + attribute] = value + ' ease-in-out';
        element.style["ms" + attribute] = value + ' ease-in-out';
        element.style["o" + attribute] = value + ' ease-in-out';
    };

    let hasClass=function(element, class_name){
        return (((' '+element.className+' ').indexOf(' '+class_name+' '))>-1);
    };

    let addClass=function(element, class_name){
        if(element.className!=='') element.className+=' ';
        element.className+=class_name;
    }

    let setClass=function(element, class_name){
        element.className=class_name;
    }

    let removeClass=function(element, class_name){
        element.className = element.className.split(class_name).join('');
    }

    let prevNode=function(element) {
        do{element = element.previousSibling;}
        while(element && element.nodeType !== 1);
        return element;
    };

    let nextNode=function(element) {
        do{element = element.nextSibling;}
        while(element && element.nodeType !== 1);
        return element;
    };

    return{
        setVendor: setVendor,
        hasClass: hasClass,
        addClass: addClass,
        setClass: setClass,
        removeClass: removeClass,
        prevNode: prevNode,
        nextNode: nextNode
    }
})();

let slidify_slideshow = (function(slideshow_id_param){
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

    let slideshow_id=slideshow_id_param;
    let div_slidify = document.getElementById(slideshow_id);
    let div_slidify_slideshow = document.getElementById(slideshow_id+'-slideshow');
    let div_slidify_thumbnails = document.getElementById(slideshow_id+'-thumbnails');
    let div_slidify_button_previous = document.getElementById(slideshow_id+'-previous');
    let div_slidify_button_next = document.getElementById(slideshow_id+'-next');

    let slides=[],images=[],thumbnails=[];

    let init = function(arguments){
        if(!div_slidify) {return false;}

        if (arguments && typeof arguments === "object") {
            settings.path = (arguments.path !== undefined) ? arguments.path : settings.path;
            settings.image_name = (arguments.image_name !== undefined) ? arguments.image_name : settings.image_name;
            settings.image_type = (arguments.image_type !== undefined) ? arguments.image_type : settings.image_type;
            settings.image_width = (arguments.image_width !== undefined) ? arguments.image_width : settings.image_width;
            settings.image_height = (arguments.image_height !== undefined) ? arguments.image_height : settings.image_height;
            settings.pages = (arguments.pages !== undefined) ? arguments.pages : settings.pages;
            settings.controls = (arguments.controls !== undefined) ? arguments.controls : settings.controls;
            settings.thumbnails = (arguments.thumbnails !== undefined) ? arguments.thumbnails : settings.thumbnails;
            settings.thumbnail_type = (arguments.thumbnail_type !== undefined) ? arguments.thumbnail_type : settings.thumbnail_type;
            settings.random = (arguments.random !== undefined) ? arguments.random : settings.random;
            settings.slideshow = (arguments.slideshow !== undefined) ? arguments.slideshow : settings.slideshow;
            settings.wrap = (arguments.wrap !== undefined) ? arguments.wrap : settings.wrap;
            settings.delay = (arguments.delay) ? arguments.delay : settings.delay;
            settings.animationSpeed = (arguments.animationSpeed) ? arguments.animationSpeed : settings.animationSpeed;
        }

        makeSlideshowContainer();
        let slides = generateImages();
        setTransitionAnimations(slides);
        if(settings.wrap) wrapContent(slides);

        
        let selected_slide;
        if(settings.random) selected_slide=rand(0,slides.length-1);
        else selected_slide=0;
        DOMUtils.addClass(slides[selected_slide],'slidify-active');

        if(slides.length > 1){
            if(settings.controls){
                div_slidify_button_next.addEventListener('click', function(){nextImage();});
                div_slidify_button_previous.addEventListener('click', function(){previousImage();});
                div_slidify_button_next.style.display = 'block';
                div_slidify_button_previous.style.display = 'block';
            }

            if(settings.thumbnails) createThumbnails();
            startSlideShow();
        }
    };

    let makeSlideshowContainer=function(){
        DOMUtils.addClass(div_slidify,'slidify');

        let div_slideshow = document.createElement("div");
        div_slideshow.id=slideshow_id+"-slideshow";
        DOMUtils.setClass(div_slideshow,'slidify-slideshow');

        let div_thumbnails = document.createElement("div");
        div_thumbnails.id=slideshow_id+"-thumbnails";
        DOMUtils.setClass(div_thumbnails,'slidify-thumbnails-container');

        let img_previous = document.createElement("img");
        img_previous.src="./images/slidify-prev.gif";

        let div_previous = document.createElement("div");
        div_previous.id=slideshow_id+"-previous";
        DOMUtils.setClass(div_previous,'slidify-slideshow-previous');

        let img_next = document.createElement("img");
        img_next.src="./images/slidify-next.gif";

        let div_next = document.createElement("div");
        div_next.id=slideshow_id+"-next";
        DOMUtils.setClass(div_next,'slidify-slideshow-next');

        div_previous.appendChild(img_previous);
        div_next.appendChild(img_next);

        div_slidify.appendChild(div_slideshow);
        div_slidify.appendChild(div_thumbnails);
        div_slidify.appendChild(div_previous);
        div_slidify.appendChild(div_next);

        
        div_slidify_slideshow = div_slideshow;
        div_slidify_thumbnails = div_thumbnails;
        div_slidify_button_previous = div_previous;
        div_slidify_button_next = div_next;
    }

    let generateImages=function(){
        for(i=0;i<settings.pages;i++){
            let div_toslide = document.createElement("div");
            div_toslide.classList.add("slidify-slide");

            let img_toslide = document.createElement("img");
            img_toslide.src=settings.path+settings.image_name+(i+1)+"."+settings.image_type;
            img_toslide.alt=settings.image_name;

            img_toslide.style=settings.image_width;
            img_toslide.style["height"]=settings.image_height;

            div_toslide.appendChild(img_toslide);
            div_slidify_slideshow.appendChild(div_toslide);

            images.push(img_toslide);
            slides.push(div_toslide);
        }
        return slides;
    }

    let setTransitionAnimations=function(slides){
        for(i=0;i<slides.length;i++){
            DOMUtils.setVendor(slides[i], 'Transition', settings.animationSpeed);
            let slide_data_src=slides[i].getAttribute('data-src');
            if(slide_data_src !== null) slides[i].style.backgroundImage = 'url('+slide_data_src+')';
        }
    }

    let wrapContent=function(){
        for(i=0;i<images.length;i++){
            images[i].onload=function(e){onLoadWrapHandler(this.offsetWidth,this.offsetHeight);};
        }
    }

    let createThumbnails=function(){
        for(let i=0;i<slides.length;i++) {
            let node = document.createElement("div");
            let thumbnail = div_slidify_thumbnails.appendChild(node);
            thumbnail.addEventListener("click", function(){onThumbnailClick(this);});
            DOMUtils.setClass(thumbnail,'slidify-thumbnail');
            DOMUtils.addClass(thumbnail,settings.thumbnail_type);
            if(DOMUtils.hasClass(slides[i],'slidify-active')){
                DOMUtils.addClass(thumbnail,'slidify-active');
            }
        }

        thumbnails = div_slidify.getElementsByClassName('slidify-thumbnail');
    };

    

    let slideShow=function() {
        let active = document.querySelector('#'+div_slidify_slideshow.getAttribute('id')+' .slidify-active');
        let next = (DOMUtils.nextNode(active)) ? DOMUtils.nextNode(active) : slides[0];

        DOMUtils.setClass(active, 'slidify-slide');
        DOMUtils.addClass(next, 'slidify-active');

        if(settings.thumbnails){
            let activePointer = document.querySelector('#'+div_slidify_thumbnails.getAttribute('id')+' .slidify-active');
            let nextPointer = (DOMUtils.nextNode(activePointer)) ? DOMUtils.nextNode(activePointer) : thumbnails[0];
            DOMUtils.removeClass(activePointer, 'slidify-active');
            DOMUtils.addClass(nextPointer,'slidify-active');
        }
    };

    let previousImage=function(){
        stopSlideShow();

        let active = document.querySelector('#'+div_slidify_slideshow.getAttribute('id')+' .slidify-active');
        let previous = (DOMUtils.prevNode(active) ? DOMUtils.prevNode(active) : slides[slides.length - 1]);

        DOMUtils.setClass(active, 'slidify-slide');
        DOMUtils.addClass(previous, 'slidify-active');

        if(settings.thumbnails){
            let activePointer = document.querySelector('#'+div_slidify_thumbnails.getAttribute('id')+' .slidify-active');
            let nextPointer = (DOMUtils.prevNode(activePointer)) ? DOMUtils.prevNode(activePointer) : thumbnails[thumbnails.length - 1];
            DOMUtils.removeClass(activePointer, 'slidify-active');
            DOMUtils.addClass(nextPointer,'slidify-active');
        }

        startSlideShow();
    };

    let nextImage=function(){
        stopSlideShow();
        slideShow();
        startSlideShow();
    };

    

    function onThumbnailClick(self){
        stopSlideShow();

        for(let i=0;i<slides.length;i++){
            if(DOMUtils.hasClass(thumbnails[i], 'slidify-active')){
                DOMUtils.removeClass(thumbnails[i], 'slidify-active');
            }
            if(DOMUtils.hasClass(slides[i], 'slidify-active')){
                DOMUtils.setClass(slides[i],'slidify-slide');
            }
        }

        let i = Array.prototype.indexOf.call(thumbnails, self);
        DOMUtils.addClass(thumbnails[i], 'slidify-active');
        DOMUtils.addClass(slides[i], 'slidify-active');

        startSlideShow();
    };

    function startSlideShow(){
        if(settings.slideshow)
            this.slideshowIntervalFunction = setInterval(function () {slideShow();}, settings.delay);
    };

    let stopSlideShow=function(){
        if(this.slideshowIntervalFunction) clearInterval(this.slideshowIntervalFunction);
    };

    

    let x=0,max_width=0,max_height=0;
    let onLoadWrapHandler=function(width,height){
        x++;
        if(width > max_width) max_width=width;
        if(height > max_height) max_height=height;
        if(x==images.length) setSlideShowSize(max_width+"px", max_height+"px");
    }

    let setSlideShowSize=function(width,height){
        div_slidify.style.width=width;
        div_slidify.style.height=height;
    }

    function rand(min, max) {return Math.floor(Math.random()*(max-min+1)+min);};

    return {init: init};
});

let slidify = (function(){
    let app = {};
    app.init = function(arguments){
        return slidify_slideshow(arguments.id).init(arguments);
    };
    return app;
})();