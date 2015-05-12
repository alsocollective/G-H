var app = {
	slickSetting: {
		dots: false,
		adaptiveHeight: false
	},
	init: function() {
		var body = $("body");
		if (body.hasClass("template-index")) {
			app.index.init();
		} else if (body.hasClass("template-product")) {
			app.product.init();
		}


		$(".lifestyle").slick(app.slickSetting);
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