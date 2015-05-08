var app = {
	slickSetting: {
		dots: false,
		adaptiveHeight: true
	},
	init: function() {
		if ($("body").hasClass("template-index")) {
			app.index.init();
		}


		$(".lifestyle").slick(app.slickSetting);
	}
}

app.gloabl = {
	init: function() {

	}
}

app.product = {
	init: function() {

	}
}

app.index = {
	init: function() {
		console.log("index");
		$(".slideshow").slick(app.slickSetting);
	}
}


app.init();