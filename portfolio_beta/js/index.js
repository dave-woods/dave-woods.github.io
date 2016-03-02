$(".scroll-click").click(function(e){
	e.preventDefault();
	var $t = $($(this).attr("target"));
	$("html, body").animate({
		scrollTop: $t.offset().top-60
	}, 1000);
});