$(document).ready(function () {
    var mainowl = $('.hero-slider');
    mainowl.owlCarousel({
        autoplay: true,
        autoplayTimeout: 5000,
        margin: 20,
        loop: true,
        nav: false,
        dots: true,
        responsive: {
            0: {
                items: 1
            },
            575: {
                items: 1
            },
            768: {
                items: 1
            },
            992: {
                items: 1
            },
            1200: {
                items: 1
            }
        }
    });

    
    var mainowl = $('.course-listing-slider');
    mainowl.owlCarousel({
        autoplay: true,
        autoplayTimeout: 5000,
        margin: 20,
        loop: true,
        nav: false,
        dots: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1.4
            },
            768: {
                items: 2
            },
            992: {
                items: 2.5
            },
            1200: {
                items: 3
            },
            1400: {
                items: 3.1
            }
        }
    });

    
    var mainowl = $('.top-results-img-slider');
    mainowl.owlCarousel({
        autoplay: true,
        autoplayTimeout: 5000,
        margin: 20,
        loop: true,
        nav: false,
        dots: true,
        responsive: {
            0: {
                items: 1
            },
            575: {
                items: 1
            },
            768: {
                items: 1
            },
            992: {
                items: 1
            },
            1200: {
                items: 1
            }
        }
    });
    
    var mainowl = $('.testimonials-slider');
    mainowl.owlCarousel({
        autoplay: true,
        autoplayTimeout: 5000,
        margin: 20,
        loop: true,
        nav: false,
        dots: false,
        responsive: {
            0: {
                items: 1
            },
            575: {
                items: 1
            },
            768: {
                items: 2
            },
            1200: {
                items: 3
            },
            1400: {
                items: 4
            }
        }
    });

    
    
    var mainowl = $('.teachers-slider');
    mainowl.owlCarousel({
        autoplay: true,
        autoplayTimeout: 5000,
        margin: 20,
        loop: true,
        nav: false,
        dots: false,
        responsive: {
            0: {
                items: 1.3
            },
            576: {
                items: 2
            },
            768: {
                items: 3
            },
            991: {
                items: 2
            },
            1200: {
                items: 3
            },
            1400: {
                items: 3.2
            }
        }
    });
});

$(document).ready(function () {
    var subowl = $('.blog-listing-slider');
    subowl.owlCarousel({
        autoplay: true,
        autoplayTimeout: 5000,
        margin: 20,
        loop: true,
        nav: false,
        dots: true,
        responsive: {
            0: {
                items: 2
            },
            575: {
                items: 2
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            },
            1200: {
                items: 3
            }
        }
    });
});