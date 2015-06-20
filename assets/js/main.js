// https://docs.shopify.com/support/your-website/themes/can-i-use-ajax-api#add-to-cart
// we need to ajax the new content into the cart, no loading from the current page.
// we should prevent default all all cart

var app = {
	slickSetting: {
		dots: true,
		autoplay: true,
		autoplaySpeed: 2000,
		adaptiveHeight: false,
		infinite: true,
		speed: 500,
		fade: true,
		cssEase: 'linear'
	},
	init: function() {
		console.log("app init started");
		app.constant.getCountry();
		app.smooth.init();
		app.signup.init();
		app.softInit();

	},
	softInit: function() {
		console.log("soft init");
		if (app.lookbook.waypoint) {
			app.lookbook.waypoint.destroy();
			app.lookbook.waypoint = null;
		}
		var body = $("#main");
		// var s = skrollr.init();
		app.slideshow.init();
		app.constant.init();
		app.social.init();
		if ($(".logos").length) {
			app.index.init();
		} else if ($("#product").length) {
			app.product.init();
			app.constant.getCountry();
		} else if ($(".collections").length) {
			app.constant.getCountry();
		} else if ($(".lookbook").length) {
			app.lookbook.init();
		}
		$(".lifestyle").slick(app.slickSetting);
		$('a[href$="mailinglist"]').click(app.signup.open);
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
			onAfter: function(url, $container, $content) {
				app.softInit();
			},
			blacklist: '.no-smoothState'
		}).data('smoothState');
	}
}

app.constant = {
	init: function() {
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
		if (!Cookies.get().closedShipping) {
			setTimeout(function() {
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
			}, 3000);
		}
		$(".shipping .exit").click(app.constant.hideShipping);
	},
	showShippingPrice: function(country) {
		if (country == "CA") {
			console.log("show canadian shipping pricing");
			$(".shipping .canada").addClass("show").delay(10000).queue(app.constant.hideShipping);
		} else if (country == "US") {
			console.log("show american shipping pricing");
			$(".shipping .unitedstates").addClass("show").delay(10000).queue(app.constant.hideShipping);
		} else {
			console.log("show world shipping")
			$(".shipping .world").addClass("show").delay(10000).queue(app.constant.hideShipping);
		}
	},
	hideShipping: function(event) {
		if (event.preventDefault) {
			event.preventDefault();
			Cookies.set("closedShipping", true, {
				expires: 1
			})
		}
		$(".shipping .show").removeClass("show");
		return false;
	}
}

app.signup = {
	init: function() {
		$(".popup-exit").click(app.signup.exit);
		$(".signupform").click(app.signup.exit);
		if (!Cookies.get("closePopup")) {
			app.signup.open();
		}
	},
	open: function(event) {
		$(".signupform").addClass("show");
		$(".signupform .email").focus();
		if (event.preventDefault) {
			event.preventDefault();
		}
		return false;
	},
	exit: function(event) {
		console.log(event.target);
		console.log(event.target.id);
		console.log($(event.target).prop("tagName"));
		if (event.target.id == "mc_embed_signup" || $(event.target).hasClass("popup") || $(event.target).prop("tagName") == "INPUT") {
			return true;
		}

		$(this).closest(".show").removeClass("show");

		Cookies.set("closePopup", true, {
			expires: 1
		});
		event.preventDefault();
		return false;
	}
}

app.product = {
	mainImage: null,
	init: function() {
		app.product.goToHash(window.location.hash + "id");
		$(".left .list a").click(app.product.productImageClick);
		$(".available-colours a").click(app.product.colourClick);
		$(".sizing button:not(.notavailable)").click(app.product.sizingClick);
		$(".fitguide").click(app.product.toogleClickGuide);
		$("form .add").click(app.product.addToCart);
		$(".main").slick({
			dots: true,
			adaptiveHeight: true,
			fade: true,
			autoplay: true,
			autoplaySpeed: 3000,
			arrows: true
		});
	},
	productImageClick: function(event) {
		event.preventDefault();
		$(this.parentNode.parentNode).find(".main img")[0].src = this.href;
		return false;
	},
	colourClick: function(event) {
		event.preventDefault();
		$(".multi-product").addClass("hide");
		$("#" + this.href.split("#").pop() + "id").removeClass("hide");
		$(".main").each(function(i, val) {
			val.slick.setPosition()
		})
		return false;
	},
	sizingClick: function(event) {
		event.preventDefault();
		var parent = $(this.parentNode.parentNode)
		if ($(this).hasClass("notavailable")) {
			return false;
			// possible to alert sold out
		}
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
		$(".added-tocart").addClass("added-active");
		setTimeout(function() {
			$("#nav-cart").removeClass("updated");
		}, 1000);
		setTimeout(function() {
			$(".added-tocart").removeClass("added-active");
		}, 3000);
	}
}

app.index = {
	slick: null,
	init: function() {
		app.index.slick = $(".logos .descriptions").slick({
			arrows: false,
			autoplay: true,
			autoplaySpeed: 3000,
		});
		app.index.slick.on("beforeChange", app.index.slidechange);
		$(".logo a").click(app.index.logoClick);
		$(".biglinks .label").click(app.index.itemClick);
	},
	slidechange: function(event, slick, currentSlide, targetSlide) {
		var logos = $(".logos .logo");
		$(logos[currentSlide]).removeClass("highlight");
		$(logos[targetSlide]).addClass("highlight");
	},
	logoClick: function(event) {
		$(".logos .descriptions").slick("slickGoTo", this.href.split("#").pop());
		event.preventDefault();
		return false;
	},
	itemClick: function(event) {
		$(this.parentNode).find("a").click()
		event.preventDefault();
		return false;
	}
}

app.lookbook = {
	waypoint: null,
	init: function() {
		$(".lookbook").find("img").eq(0).attr("id", "waypoint");
		app.lookbook.waypoint = new Waypoint({
			element: document.getElementById("waypoint"),
			handler: app.lookbook.wpChecker
		})
	},
	wpChecker: function() {
		console.log("Shadowbox");
		$("#main").toggleClass("shadow");
	}
}

app.slideshow = {
	init: function() {
		$(".slideshow").slick(app.slickSetting);
		var video = $(".slideshow iframe");
		if (video.length) {
			app.slideshow.setupvideo();
		}
	},
	setupvideo: function() {
		var t = $(".slideshow iframe"),
			e = t.parent(),

			height = e.height(),
			width = e.width();
		var n = 16 / 9,
			r = width / height;
		var i = width,
			s = height;
		translate3d = null;
		if (r > n) {
			height = width * (9 / 16);
			translate3d = "translate3d(0px, " + (s - height) / 2 + "px, 0px)"
		} else {
			width = height * (16 / 9);
			translate3d = "translate3d(" + (i - width) / 2 + "px, 0px, 0px)"
		}
		t.css({
			height: height,
			width: width,
			"-webkit-transform": translate3d,
			"-moz-transform": translate3d,
			"-ms-transform": translate3d,
			"-o-transform": translate3d,
			transform: translate3d
		})
	}
}

app.social = {
	init: function() {
		$(".social .facebook,.social-article .facebook,.social-product .facebook").click(app.social.events.facebookPageClick)
		$(".social .twitter,.social-article .twitter,.social-product .twitter").click(app.social.events.twitterPageClick)

		if ($(".socialbutton").length) {
			app.social.initilizeButton();
		}
	},
	initilizeButton: function() {
		$(".article .socialbutton").click(app.social.socialClickArticle);
	},
	socialClickArticle: function(event) {
		$(".sociallinks").click();
		var url = $(this).closest("a")[0].href,
			el = $(document.createElement("a"));
		el[0].href = url;
		el[0].appendChild(app.social.generate.facebook(url)[0])
		el[0].appendChild(app.social.generate.twitter(url)[0])
		el.addClass("sociallinks");
		$(this).closest(".article")[0].appendChild(el[0]);
		el.click(app.social.close);
		event.preventDefault();
		return false;
	},
	close: function(event) {
		this.parentNode.removeChild(this);
		event.preventDefault();
		return false;
	},
	generate: {
		facebook: function(url) {
			var el = $(document.createElement("button"));
			el.addClass("facebook");
			el[0].href = url + " " + app.social.facebook;
			$(".social .facebook svg").clone().appendTo(el);
			el.click(app.social.events.facebookClick);
			return el
		},
		twitter: function(url) {
			var el = $(document.createElement("button"));
			el.addClass("twitter");
			el[0].href = "https://twitter.com/intent/tweet?text=" + url + " " + app.social.twitter;
			$(".social .twitter svg").clone().appendTo(el);
			el.click(app.social.events.twitterClick);
			return el
		}
	},
	events: {
		twitterClick: function(event) {
			var w = window.open(this.href + " " + app.social.facebook, this.target || "_blank", 'menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=no,resizable=no,dependent,width=475,height=248,left=0,top=0');
			event.preventDefault();
			event.stopPropagation();
			return false;
		},
		twitterPageClick: function(event) {
			var w = window.open("https://twitter.com/intent/tweet?text=" + window.location.href + " " + app.social.twitter, "_blank", 'menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=no,resizable=no,dependent,width=475,height=248,left=0,top=0');
			event.preventDefault();
			event.stopPropagation();
			return false;
		},
		facebookClick: function(event) {
			FB.ui({
				method: 'send',
				link: event.target.href
			});
			event.stopPropagation();
			event.preventDefault();
			return false;
		},
		facebookPageClick: function(event) {
			FB.ui({
				method: 'send',
				link: window.location.href
			});
			event.stopPropagation();
			event.preventDefault();
			return false;
		}
	}
}