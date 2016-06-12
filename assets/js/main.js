$(document).ready(function(){
	$(".index-wrap .button").on("click", function(){
		$this = $(this);
		$this.css("background-color", "#2493DA");
		setTimeout(function(){
			$this.css("background-color", "#fff");
		}, 2000);
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
			progressColor: "#cf4111",
			minPxPerSec: 10000
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
			var i = bnlist.indexOf(basename);
			loadWavefile(bnlist[i == 0 ? bnlist.length - 1 : i - 1]);
		});
		$("#next-clip").on("click", function(){
			var i = bnlist.indexOf(basename);
			loadWavefile(bnlist[i == bnlist.length - 1 ? 0 : i + 1]);
		});

		$(".feedback-btn").on("click", function(){
			var id = $(this).attr("id");
			var d = {id: basename, content: $(this).attr("id")};
			//writeToFile(d);
			if (id == "good")
				$("#next-clip").trigger("click");
			else
			{
				$("#bad-reason").fadeIn(400).focus();
			}
		});

		$("#utterance-text small").on("click", replaceText);

		function replaceText()
		{
			var ut = $("#text p").html();
			var editableText = $("<textarea id='edit-utterance' style='width:100%'></textarea>");
			editableText.val(ut);
			$("#text p").replaceWith(editableText);
			editableText.focus().on("blur keyup", function(e){
				if ((e.type == "keyup" && (e.which == 27 || e.which == 13)) || e.type == "blur")
					editableTextBlurred.call(e.target);
			});
		}

		function editableTextBlurred()
		{
			var html = $(this).val();
			var viewableText = $("<p>");
			viewableText.html(html);
			$(this).replaceWith(viewableText);
		}

		$("#bad-reason").on("keyup focusout", function(e){
			if((e.type == "keyup" && e.which == 27) || e.type == "focusout")
			{
				e.preventDefault();
				$("#bad-reason").fadeOut(400);
			}
			else if (e.which == 13 && $.trim($("#bad-reason").val()))
			{
				e.preventDefault();
				$("#bad-reason").fadeOut(400, function(){
					console.log($("#bad-reason").val());
					$("#next-clip").trigger("click");
				});
			}
		});

		$(document).keydown(function(e){
			if(!$("#filesearch-tb, #bad-reason, #edit-utterance").is(':focus') && e.which == 32)
				e.preventDefault();
			keys[e.which] = true;
		});

		$(document).keyup(function(e){
			delete keys[e.which];

			if (!$("#filesearch-tb, #bad-reason, #edit-utterance").is(':focus'))
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
				else if(e.which == 66)
				{
					e.preventDefault();
					$("#bad").trigger("click");
				}
				else if(e.which == 71)
				{
					e.preventDefault();
					$("#good").trigger("click");
				}
				else if(e.which == 188)
				{
					e.preventDefault();
					$("#prev-clip").trigger("click");
				}
				else if(e.which == 190)
				{
					e.preventDefault();
					$("#next-clip").trigger("click");
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
				}
				else if(e.which == 221)
				{
					e.preventDefault();
					wavesurfer.zoom(pxPerSec > 2000 ? pxPerSec : pxPerSec += 50);
				}
			}
		});

		wavesurfer.on("ready", function(){
			duration = (wavesurfer.getDuration()).toFixed(3);
			$(".intern-vis-wrap #labels").html("");
			$("#audio-title").text(basename);
			$("#audio-duration").text(duration);
			$("#audio-position").text("0.000");
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
							if (basename.startsWith("blizzdir/blizzard2016-enUKfls-"))
								label.time = (parseFloat(label.time) / parseFloat(labelLines[labelLines.length - 2].split(" ")[0])) * duration;
							var labelWidth = (label.time - prevTime) / duration;
							$(".intern-vis-wrap #labels").append("<div class='label' style='flex:" 
								+ labelWidth + (label.lab == "_" ? ";visibility:hidden;" : ";") 
								+ "' data-ipa='" + xsa_ipa(label.lab) + "' data-start='" + prevTime
								+ "' data-end='" + label.time + "'>" + label.lab + "</div>");
							prevTime = label.time;
						}
					}
				}); // end loop over label lines
				$(".intern-vis-wrap #labels .label").on("click", function(){
					wavesurfer.play(parseFloat($(this).data("start")), parseFloat($(this).data("end")));
				}).on("mouseenter", function(){
					var s = parseFloat($(this).data("start"));
					var e = parseFloat($(this).data("end"));

					$("#waveform").append("<div class='wave-highlight' " +
						"style='background-color:#999;position:absolute;height:"+
						$("wave:first").height()+"px;top:20px;left:"
						+(s/duration*100)+"%;width:"+((e-s)/duration*100)+"%'></div>");
				}).on("mouseleave", function(){
					$(".wave-highlight").remove();
				});
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
		var bnlist = [
		"blizzdir/blizzard2016-enUKfls-1333",
		"blizzdir/blizzard2016-enUKfls-1996",
		"blizzdir/blizzard2016-enUKfls-2037",
		"blizzdir/blizzard2016-enUKfls-2040",
		"blizzdir/blizzard2016-enUKfls-2042",
		"blizzdir/blizzard2016-enUKfls-2136",
		"blizzdir/blizzard2016-enUKfls-2886",
		"blizzdir/blizzard2016-enUKfls-2887",
		"blizzdir/blizzard2016-enUKfls-2902",
		"blizzdir/blizzard2016-enUKfls-3161",
		"blizzdir/blizzard2016-enUKfls-3234",
		"blizzdir/blizzard2016-enUKfls-3375",
		"blizzdir/blizzard2016-enUKfls-3377",
		"blizzdir/blizzard2016-enUKfls-3379",
		"blizzdir/blizzard2016-enUKfls-3381",
		"blizzdir/blizzard2016-enUKfls-3382",
		"blizzdir/blizzard2016-enUKfls-3445",
		"blizzdir/blizzard2016-enUKfls-3848",
		"blizzdir/blizzard2016-enUKfls-3992",
		"blizzdir/blizzard2016-enUKfls-3993",
		"blizzdir/blizzard2016-enUKfls-3994",
		"blizzdir/blizzard2016-enUKfls-4117",
		"blizzdir/blizzard2016-enUKfls-4121",
		"blizzdir/blizzard2016-enUKfls-4130",
		"blizzdir/blizzard2016-enUKfls-4303",
		"blizzdir/blizzard2016-enUKfls-4396",
		"blizzdir/blizzard2016-enUKfls-4398",
		"blizzdir/blizzard2016-enUKfls-4399",
		"blizzdir/blizzard2016-enUKfls-4400",
		"blizzdir/blizzard2016-enUKfls-4404",
		"blizzdir/blizzard2016-enUKfls-0156",
		"blizzdir/blizzard2016-enUKfls-1793",
		"arctic_a0566", "arctic_a0567"
		];
		
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