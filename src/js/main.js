var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var views = sp.require("sp://import/scripts/api/views");
var player = models.player;
var active = false;

var trackHistory = new Array();

$(function() {

	addAudioListener();
	
	$('#clear_button').click(function() {
		clearList();
	});
	
	$('#hide_intro').click(function() {
		$('#intro').fadeOut();
	});
	
	$('#dump_button').click(function() {
		showDump();
	});
	
	$('#cancel_dump').click(function() {
		cancelDump();
	});
	
	$('#action_dump').click(function() {
		performDump();
	});
	
	$('#activate_button').click(function() {
		toggleActive();
	});
	
});

function toggleActive() {
	var target = $('#activate_button');
	if(active) {
		target.addClass('sp-primary');
		target.text('Activate');
		active = false;
		$('.deactivate_text').hide();
		$('.activate_text').show();
	} else {
		target.removeClass('sp-primary');
		target.text('Deactivate');
		active = true;
		$('.activate_text').hide();
		$('.deactivate_text').show();
	}
}

function getTrack() {
   var playerTrackInfo = sp.trackPlayer.getNowPlayingTrack();
   return playerTrackInfo;
}

function inHistory(uri) {
	for(i = 0; i < trackHistory.length; i++) {
		if(trackHistory[i] == uri) {
			return true;
		}
	}
	return false;
}

function showDump() {
	$('#buttons').hide();
	$('#dump_box').fadeIn();
}

function cancelDump() {
	$('#dump_box').hide();
	$('#buttons').fadeIn();
	$('#playlist_name').val('');
}

function performDump() {
	var name = $('#playlist_name').val();
	var playList = new models.Playlist(name);
	for(i = 0; i < trackHistory.length; i++) {
		playList.add(trackHistory[i]);
	}
	cancelDump();
	clearList();
	$("#created_playlist").show().animate({opacity: 1.0}, 3000).fadeOut(1000);
}

function addAudioListener() {
    sp.trackPlayer.addEventListener("playerStateChanged", function (event) {
		if(!active) {
			return;
		}
        var track = player.track;
		if(!inHistory(track.data.uri)) {
			trackHistory.push(track.data.uri);
			printTrackList();
		}
    });
}

function printTrackList () {
	var tpl = new models.Playlist();
	var tempList = new views.List(tpl);
	for(i = 0; i < trackHistory.length; i++) {
		tpl.add(models.Track.fromURI(trackHistory[i]));
	}
	tempList.node.classList.add("sp-light");
	$('#tracklist').html(tempList.node);
	if(trackHistory.length == 0) {
		$('#no_tracks').show();
	} else {
		$('#no_tracks').hide();
	}
}

function clearList() {
	trackHistory = new Array();
	printTrackList();
}