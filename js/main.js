$(document).ready(function(){
	$(".button").on("click", function(){
		$this = $(this);
		$this.css("background-color", "#2493DA");
		setTimeout(function(){
			$this.css("background-color", "#fff");
		}, 2000);
	});
});