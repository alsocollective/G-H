// https://docs.shopify.com/support/your-website/themes/can-i-use-ajax-api#add-to-cart
// we need to ajax the new content into the cart, no loading from the current page.
// we should prevent default all all cart

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
		// var s = skrollr.init();
		app.slideshow.init();
		app.constant.init();
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
			// onStart: {
			// 	duration: 500,
			// 	render: function(url, $container) {
			// 		// $('#main').toggleClass("is-exiting");
			// 		// app.smooth.content.restartCSSAnimations();
			// 		app.smooth.body.animate({
			// 			scrollTop: 0
			// 		});
			// 	}
			// },
			// onProgress: {
			// 	render: function(url, $container) {
			// 		app.smooth.body.css('cursor', 'wait');
			// 		app.smooth.body.find('a').css('cursor', 'wait');
			// 	}
			// },
			// onEnd: {
			// 	duration: 500,
			// 	render: function(url, $container, $content) {

			// 		console.log("ON END");
			// 		app.smooth.body.css('cursor', 'auto');
			// 		app.smooth.body.find('a').css('cursor', 'auto');
			// 		$container.html($content);
			// 		app.softInit();
			// 	}
			// },
			onAfter: function(url, $container, $content) {
				app.softInit();
			}
		}).data('smoothState');
	}
}

app.constant = {
	init: function() {
		app.constant.getCountry();
		$(".hamburger a").click(app.constant.toggleNav);
		$("#nav a").click(app.constant.closeNavOnClick);
	},
	toggleNav: function(event) {
		event.preventDefault();
		$("#main").toggleClass("opennav");
		return false;
	},
	closeNavOnClick: function(event) {
		console.log("close NAV");
		if (this.href.split("#").pop() != "togglenav") {
			$("#main.opennav").removeClass("opennav");
		}
	},
	getCountry: function(event) {
		if (Cookies.get().country) {
			console.log("using local cookie to get country")
			app.constant.showShippingPrice(Cookies.get().country);
		} else {
			$.getJSON("http://services.also-static.com/loc/&callback=?", function(data) {
				console.log("using reuqest cookie to get country")
				Cookies.set("country", data.countryCode);
				app.constant.showShippingPrice(data.countryCode)
			});
		}
	},
	showShippingPrice: function(country) {
		console.log(country);
		if (country == "CA") {
			console.log("show canadian shipping pricing");
			$(".shipping .canada").addClass("show");
		} else if (country == "US") {
			console.log("show american shipping pricing");
			$(".shipping .unitedstates").addClass("show");
		} else {
			console.log("show world shipping")
			$(".shipping .world").addClass("show");
		}
		setTimeout(app.constant.displayShipping, 10000);
	},
	displayShipping: function() {
		$(".shipping .show").removeClass("show");
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
		$("form .add").click(app.product.addToCart);
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
	},
	addToCart: function(event) {
		event.preventDefault();
		event.stopPropagation();

		var params = {
			type: 'POST',
			url: '/cart/add.js',
			data: $(this.parentNode).serialize(),
			dataType: 'json',
			success: function(data) {
				console.log(data);
				jQuery.getJSON('/cart.js', app.product.updateCart);
			}
		};
		jQuery.ajax(params);
		return false;
	},
	updateCart: function(data) {
		console.log(data);
		$("#cartitemcount").html(data.item_count)
		$("#carttotalcost").html("$" + parseFloat(data.total_price * 0.01).toFixed(2));
		$("#nav-cart").addClass("updated");
		setTimeout(function() {
			$("#nav-cart").removeClass("updated");
		}, 1000)
	}

}

app.index = {
	init: function() {
		console.log("index");
	}
}

app.slideshow = {
	init: function() {
		$(".slideshow").slick(app.slickSetting);
	}
}