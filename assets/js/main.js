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

	function writeToFile(datain)
	{
		$.ajax
	    ({
	        type: "GET",
	        dataType : 'json',
	        async: false,
	        url: '/internship/vis/test.php',
	        data: { data: JSON.stringify(datain) }
	    });
	}

	var lb = "_";
	var lbpos = 0;
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
			progressColor: "#cf4111",
			scrollParent: false
		});
		
		wavesurfer.load(path + basename + ".wav");
		
		$("#play-btn").on("click", function(){
			wavesurfer.playPause();
		});

		$("#prev-clip").on("click", function(){
			basename = "arctic_a0566"
			wavesurfer.load(path + basename + ".wav");
		});
		$("#next-clip").on("click", function(){
			basename = "arctic_a0567"
			wavesurfer.load(path + basename + ".wav");
		});

		$(document).keydown(function(e){
			if(e.which == 32)
				e.preventDefault();
			keys[e.which] = true;
		});

		$(document).keyup(function(e){
			delete keys[e.which];

			var offset = 0.1;
			if(e.which == 32)
			{
				e.preventDefault();
				$("#play-btn").click();
			}
			else if(e.which == 37)
			{
				e.preventDefault();
				wavesurfer.skip(-offset * (keys[16] ? 0.1 : 1.0));
				$("#audio-position").text(wavesurfer.getCurrentTime().toFixed(3));
			}
			else if(e.which == 39)
			{
				e.preventDefault();
				wavesurfer.skip(offset * (keys[16] ? 0.1 : 1.0));
				$("#audio-position").text(wavesurfer.getCurrentTime().toFixed(3));
			}
			else if(e.which == 90)
			{
				e.preventDefault();
				playbackRate = playbackRate == 1.0 ? 0.5 : 1.0;
				wavesurfer.setPlaybackRate(playbackRate);
			}
		});

		wavesurfer.on("ready", function(){
			lb = "_";
			lbpos = 0;
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
				var perc = ct / wavesurfer.getDuration().toFixed(3) * 100;
				$(".intern-vis-wrap #label").append("<span style='position:absolute; left:" 
					+ (perc - 0.5) + "%; top:50%;'>" + lb + "</span");
			}
		});
	} // endif wavesurfer loaded
});