$(document).ready(function(){
	$(".index-wrap .button").on("click", function(){
		$this = $(this);
		$this.css("background-color", "#2493DA");
		setTimeout(function(){
			$this.css("background-color", "#fff");
		}, 2000);
	});

	var keys = {};
	var path = "/assets/audio/";
	var basename = "arctic_a0566";
	var playbackRate = 1.0;

	if (typeof WaveSurfer !== 'undefined')
	{
		var wavesurfer = WaveSurfer.create({
			container: "#waveform",
			waveColor: "#ccc",
			progressColor: "#cf4111",
			scrollParent: false
		});
		wavesurfer.load(path + basename + ".wav");
		$("#play-btn").on("click", function(){
			wavesurfer.playPause();
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
			$("#audio-title").text(basename);
			$("#audio-duration").text(wavesurfer.getDuration().toFixed(3));
		});
		wavesurfer.on("audioprocess", function(){
			$("#audio-position").text(wavesurfer.getCurrentTime().toFixed(3));
		});

		var timings = {};

		$.get(path + basename + ".txt", function(data){
			$(".intern-vis-wrap #text").html("<p>" + data + "</p>");
		}, "text");
		$.get("/assets/audio/arctic_a0566.lab", function(data){
			//$(".intern-vis-wrap #label").html("<p>" + data + "</p>");
			var d = data.split("\n");
			$.each(d, function(index, val) {
				if (index !== 0)
				{
					var v = val.split(" ");
					$(".intern-vis-wrap #label").append("<p>" + v[0] + "---" + v[2] + "</p>");
				}
			});
		}, "text");
	}
});