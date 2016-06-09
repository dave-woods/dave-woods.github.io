$(document).ready(function(){
	$(".index-wrap .button").on("click", function(){
		$this = $(this);
		$this.css("background-color", "#2493DA");
		setTimeout(function(){
			$this.css("background-color", "#fff");
		}, 2000);
	});

	$(".feefback-btn").on("click", function(){
		var d = {id: basename, content: $(this).attr("id")};
		//writeToFile(d);
	});

	// function writeToFile(datain)
	// {
	// 	$.ajax
	// 	({
	// 		type: "GET",
	// 		dataType : 'json',
	// 		async: false,
	// 		url: '/internship/vis/test.php',
	// 		data: { data: JSON.stringify(datain) }
	// 	});
	// }

	var lb = "_"; // to be skipped
	var lbpos = 0; // to be skipped
	var keys = {};
	var timings = [];
	var path = "/assets/audio/";
	var basename = "arctic_a0566";
	var playbackRate = 1.0;

	if (typeof WaveSurfer !== 'undefined')
	{
		var wavesurfer = WaveSurfer.create({
			container: "#waveform",
			cursorWidth: 0,
			waveColor: "#ccc",
			progressColor: "#cf4111"
		});
		
		var pxPerSec = 200;

		wavesurfer.load(path + basename + ".wav");
		
		$("#play-btn").on("click", function(){
			wavesurfer.playPause();
		});

		$("#prev-clip").on("click", function(){
			loadWavefile("arctic_a0566");
		});
		$("#next-clip").on("click", function(){
			loadWavefile("arctic_a0567");
		});

		$(document).keydown(function(e){
			if(!$("#filesearch-tb").is(':focus') && e.which == 32)
				e.preventDefault();
			keys[e.which] = true;
		});

		$(document).keyup(function(e){
			delete keys[e.which];

			if (!$("#filesearch-tb").is(':focus'))
			{
				var offset = 0.1;
				if(e.which == 32)
				{
					e.preventDefault();
					$("#play-btn").click();
				}
				else if(e.which == 37)
				{
					e.preventDefault();
					if (keys[16])
						wavesurfer.skip(-offset * 0.1);
					else if (keys[17])
						wavesurfer.seekTo(0);
					else
						wavesurfer.skip(-offset);
					$("#audio-position").text(wavesurfer.getCurrentTime().toFixed(3));
				}
				else if(e.which == 39)
				{
					e.preventDefault();
					if (keys[16])
						wavesurfer.skip(offset * 0.1);
					else if (keys[17])
						wavesurfer.seekTo(1);
					else
						wavesurfer.skip(offset);
					$("#audio-position").text(wavesurfer.getCurrentTime().toFixed(3));
				}
				else if(e.which == 90)
				{
					e.preventDefault();
					playbackRate = playbackRate == 1.0 ? 0.5 : 1.0;
					wavesurfer.setPlaybackRate(playbackRate);
				}
				else if(e.which == 219)
				{
					e.preventDefault();
					wavesurfer.zoom(pxPerSec < 250 ? pxPerSec : pxPerSec -= 50);
				}
				else if(e.which == 221)
				{
					e.preventDefault();
					wavesurfer.zoom(pxPerSec > 2000 ? pxPerSec : pxPerSec += 50);
				}
			}
		});

		wavesurfer.on("ready", function(){
			lb = "";
			lbpos = 1; // skip the initial underscore
			timings = [];
			$(".intern-vis-wrap #label").html("");
			$("#audio-title").text(basename);
			$("#audio-duration").text(wavesurfer.getDuration().toFixed(3));
			$.get(path + basename + ".txt", function(data){
				$(".intern-vis-wrap #text").html("<p>" + data + "</p>");
			}, "text");
			$.get(path + basename + ".lab", function(data){
				var d = data.split("\n");
				$.each(d, function(index, val) {
					if (index != 0)
					{
						var v = val.split(" ");
						var o = {
							"time" :(Number(v[0]).toFixed(3)),
							"lab": v[2]
						}
						timings.push(o);
					}
				});
			}, "text");
		});

		wavesurfer.on("audioprocess", function(){
			var ct = wavesurfer.getCurrentTime().toFixed(3);
			$("#audio-position").text(ct);
			
			if (lbpos <= timings.length && ct > timings[lbpos].time && ct < timings[lbpos + 1].time)
			{
				lb = timings[lbpos++].lab;
				// var perc = ct / wavesurfer.getDuration().toFixed(3) * 100;
				// $(".intern-vis-wrap #label").append("<span style='position:absolute; left:" 
				// 	+ (perc - 0.5) + "%; top:50%;z-index:6' data-ipa='" + xsa_ipa(lb) + "'>" + lb + "</span");
				var perc = ct / wavesurfer.getDuration().toFixed(3) * $("canvas:first").width();
				$(".intern-vis-wrap #label").append("<span style='left:" 
					+ (perc - 0.5) + "px;' data-ipa='" + xsa_ipa(lb) + "'>" + lb + "</span");
			}
		});

		$("#audio-title").on("click", function(){
			$("#filesearch").fadeIn(250, function(){
				$("#filesearch-tb").focus();
			});
		});
		$("#filesearch").on("keyup focusout", function(e){
			if((e.type == "keyup" && e.which == 27) || e.type == "focusout")
			{
				e.preventDefault();
				$("#filesearch").fadeOut(250, function(){
					$("#filesearch-tb").val("").keyup();
				});
			}
		});
		var bnlist = ["arctic_a0566", "arctic_a0567"];
		$.each(bnlist, function(i, bn){
			$("#filesearch-sb").append("<span>" + bn + "</span>");
		});
		$("#filesearch-sb span").on("click", function() {
			loadWavefile($(this).text());
		});

		function loadWavefile(filename)
		{
			basename = filename;
			wavesurfer.load(path + basename + ".wav");
		}

		// :contains pseudo-selector defined below
		$("#filesearch-tb").keyup(function(){
			$("#filesearch-sb span:contains(" + $("#filesearch-tb").val() + ")").show();
			$("#filesearch-sb span:not(:contains(" + $("#filesearch-tb").val() + "))").hide();
		});
		// });

		// create ":contains" pseudo-selector to make filtering better
		$.expr[":"].contains = $.expr.createPseudo(function(arg) {
			return function(elem) {
				return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
			};
		});
	} // endif wavesurfer loaded
});