$(document).ready(function(){
	$(".index-wrap .button").on("click", function(){
		$this = $(this);
		$this.css("background-color", "#2493DA");
		setTimeout(function(){
			$this.css("background-color", "#fff");
		}, 2000);
	});

	$(".intern-report-wrap").ready(function(){
		var dir = ".";
		var fileextension = ".html";
		$.ajax({
			url: dir,
			success: function(data){
				$(data).find("a:contains(" + fileextension + ")").each(function(){
					var filename = this.href.replace(window.location.host, "").replace("http:///", "");
					$(".report-list").append($("<li><a href=\"" + filename + "\">" + filename + "</a></li>"));
					console.log("success");
				});
			},
			error: function(){
				console.log("error");
			}
		});
	});
});