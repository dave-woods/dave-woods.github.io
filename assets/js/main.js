$(document).ready(function(){
	$(".index-wrap .button").on("click", function(){
		$this = $(this);
		$this.css("background-color", "#2493DA");
		setTimeout(function(){
			$this.css("background-color", "#fff");
		}, 2000);
	});

	$(".feedback-btn").on("click", function(){
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

	

	if (typeof WaveSurfer !== 'undefined')
	{
		var wavesurfer = WaveSurfer.create({
			container: "#waveform",
			cursorWidth: 0,
			waveColor: "#ccc",
			progressColor: "#cf4111"
		});
		
		var keys = {};
		var path = "/assets/audio/";
		var basename = "arctic_a0566";//"blizzard2016-enUKfls-0156";
		var playbackRate = 1.0;
		var pxPerSec = 50;
		var duration = 0;

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
					$("#audio-position").text(parseFloat(wavesurfer.getCurrentTime()).toFixed(3));
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
					$("#audio-position").text(parseFloat(wavesurfer.getCurrentTime()).toFixed(3));
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
					wavesurfer.zoom(pxPerSec < 50 ? pxPerSec : pxPerSec -= 50);
					$("#wavelabel-wrap").width($("canvas:first").width());
				}
				else if(e.which == 221)
				{
					e.preventDefault();
					wavesurfer.zoom(pxPerSec > 2000 ? pxPerSec : pxPerSec += 50);
					$("#wavelabel-wrap").width($("canvas:first").width());
				}
			}
		});

		wavesurfer.on("ready", function(){
			duration = (wavesurfer.getDuration()).toFixed(3);
			$(".intern-vis-wrap #labels").html("");
			$("#audio-title").text(basename);
			$("#audio-duration").text(duration);
			$.get(path + basename + ".txt", function(data){
				$(".intern-vis-wrap #text").html("<p>" + data + "</p>");
			}, "text");
			$.get(path + basename + ".lab", function(data){
				var labelLines = data.split("\n");
				var prevTime = 0.000;
				$.each(labelLines, function(labelLineIndex, labelLine) {
					if (!labelLine.startsWith("#")) // ignore comments
					{
						var ll = labelLine.split(" ");
						if (ll.length > 2) // make sure the line is formatted as expected
						{
							var label = {
								"time" :(parseFloat(ll[0]).toFixed(3)),
								"lab": ll[2]
							}

							// temp fix
							if (basename == "blizzard2016-enUKfls-0156")
								label.time = (parseFloat(label.time) / 22.23) * 8.07;
							
							var labelWidth = (label.time - prevTime) / duration;
							$(".intern-vis-wrap #labels").append("<div class='label' style='flex:" 
								+ labelWidth + (label.lab == "_" ? ";visibility:hidden;" : ";") 
								+ "' data-ipa='" + xsa_ipa(label.lab) + "' data-start='" + prevTime
								+ "' data-end='" + label.time + "'>" + label.lab + "</div>");
							prevTime = label.time;
							$(".intern-vis-wrap #labels .label").on("click", function(){
								wavesurfer.play(parseFloat($(this).data("start")), parseFloat($(this).data("end")));
							});
						}
					}
				}); // end loop over label lines
			}, "text"); // end get label file
		}); // end on wavesurfer ready
		
		// Update current time on-screen
		wavesurfer.on("audioprocess", function(){
			$("#audio-position").text(parseFloat(wavesurfer.getCurrentTime()).toFixed(3));
		});

		// Open file searchbox
		$("#audio-title").on("click", function(){
			$("#filesearch").fadeIn(250, function(){
				$("#filesearch-tb").focus();
			});
		});

		// Quit file searching and hide searchbox
		$("#filesearch").on("keyup focusout", function(e){
			if((e.type == "keyup" && e.which == 27) || e.type == "focusout")
			{
				e.preventDefault();
				$("#filesearch").fadeOut(250, function(){
					$("#filesearch-tb").val("").keyup();
				});
			}
		});

		// TODO: get files from server
		var bnlist = [ "blizzard2016-enUKfls-0156",
		"arctic_a0566", "arctic_a0567", "arctic_a0566", "arctic_a0567",
		"arctic_a0566", "arctic_a0567", "arctic_a0566", "arctic_a0567",
		"arctic_a0566", "arctic_a0567", "arctic_a0566", "arctic_a0567",
		"arctic_a0566", "arctic_a0567", "arctic_a0566", "arctic_a0567"];
		
		// TODO: maybe only load from server when search query sent?
		// Add files to searchable list
		$.each(bnlist, function(i, bn){
			$("#filesearch-sb").append("<span>" + bn + "</span>");
		});

		// Load selected files
		$("#filesearch-sb span").on("click", function() {
			loadWavefile($(this).text());
		});

		// Load a given file
		function loadWavefile(filename)
		{
			basename = filename;
			wavesurfer.load(path + basename + ".wav");
		}

		// Filter selectable files based on user input
		$("#filesearch-tb").keyup(function(){
			$("#filesearch-sb span:contains(" + $("#filesearch-tb").val() + ")").show();
			$("#filesearch-sb span:not(:contains(" + $("#filesearch-tb").val() + "))").hide();
		});

		// create ":contains" pseudo-selector to make filtering better
		$.expr[":"].contains = $.expr.createPseudo(function(arg){
			return function(elem) {
				return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
			};
		});
	} // endif wavesurfer loaded
});