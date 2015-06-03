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
		if ($(".logos").length) {
			app.index.init();
		} else if ($("#product").length) {
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
		app.product.goToHash(window.location.hash);
		$(".left .list a").click(app.product.productImageClick);
		$(".available-colours a").click(app.product.colourClick);
		$(".sizing button:not(.notavailable)").click(app.product.sizingClick);
		$(".fitguide").click(app.product.toogleClickGuide);
	},
	productImageClick: function(event) {
		event.preventDefault();
		$(this.parentNode.parentNode).find(".main img")[0].src = this.href;
		return false;
	},
	colourClick: function(event) {
		event.preventDefault();
		$(".multi-product").addClass("hide");
		$("#" + this.href.split("#").pop()).removeClass("hide");
		return false;
	},
	sizingClick: function(event) {
		event.preventDefault();
		var parent = $(this.parentNode.parentNode)
		parent.find("button.selected").removeClass("selected");
		$(this).addClass("selected");
		parent.find(".sizeselector").val(this.id);
		return false;
	},
	toogleClickGuide: function(event) {
		event.preventDefault();
		$(".sizechart").toggleClass("hide");
		return false;
	},
	goToHash: function(hash) {
		if (hash) {
			$(".multi-product").addClass("hide");
			$("#" + hash.split("#").pop()).removeClass("hide");
		}
	}

}

app.index = {
	init: function() {
		console.log("index");
		$(".slideshow").slick(app.slickSetting);
	}
}


app.init();