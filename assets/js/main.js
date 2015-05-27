var app = {
	slickSetting: {
		dots: false,
		adaptiveHeight: false
	},
	init: function() {
		console.log("app init started");
		app.smooth.init();
		app.softInit();
	},
	softInit: function() {
		console.log("soft init");
		var body = $("#main");
		var s = skrollr.init();
		if (body.hasClass("template-index")) {
			app.index.init();
		} else if (body.hasClass("template-product")) {
			app.product.init();
		}
		$(".lifestyle").slick(app.slickSetting);
		app.smooth.body.height("");
	}
}

app.smooth  = {
	init: function() {
		if (app.smooth.content == undefined) {
			console.log("smooth setup");
			app.smooth.setup();
		}
	},
	setup: function() {
		app.smooth.body = $('html, body'),
		app.smooth.content = $('#main').smoothState({
			onStart: {
				duration: 500,
				render: function(url, $container) {
					app.smooth.content.toggleAnimationClass('is-exiting');
					app.smooth.body.animate({
						scrollTop: 0
					});
				}
			},
			onProgress: {
				render: function(url, $container) {
					app.smooth.body.css('cursor', 'wait');
					app.smooth.body.find('a').css('cursor', 'wait');
				}
			},
			onEnd: {
				duration: 500,
				render: function(url, $container, $content) {
					app.smooth.body.css('cursor', 'auto');
					app.smooth.body.find('a').css('cursor', 'auto');
					$container.html($content);
					app.softInit();
				}
			},
			callback: function(url, $container, $content) {

			}
		}).data('smoothState');
	}
}

app.gloabl = {
	init: function() {

	}
}

app.product = {
	mainImage: null,
	init: function() {
		app.product.mainImage = $(".left .main img")[0];
		$(".left .list a").click(app.product.productImageClick);
	},
	productImageClick: function(event) {
		event.preventDefault();
		app.product.mainImage.src = this.href;
		return false;
	}
}

app.index = {
	init: function() {
		console.log("index");
		$(".slideshow").slick(app.slickSetting);
	}
}


app.init();