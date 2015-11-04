//run script when page is loaded or tab changes
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	//add styles we'll use later
	$('head').append('<style>.star-badge:before{content:"\\f001" !important; color: #ffac33 !important;}</style>');
	
	//run function on inital content
	favStream();
	
	//set observer to run function when new tweets are added to the stream
	var streamContainer = document.getElementsByClassName('stream-container')[0];
	var mainObserver = new MutationObserver(function(mutations) {
		favStream();
	  });    
	var config = { attributes: true, childList: true, characterData: true };
	mainObserver.observe(streamContainer, config);

	//set observer to run function when notification "toast" appears
	var toastContainer = document.getElementById('spoonbill-outer');
	var toastObserver = new MutationObserver(function(mutations) {
		favToast();
	  });    
	var config = { attributes: true, childList: true, characterData: true };
	toastObserver.observe(toastContainer, config);
});


function favStream(){
	//change heart button to star
	var spriteUrl = chrome.extension.getURL('assets/starsprite.png');
	var animation = $('.HeartAnimation');
	animation.css('background-image', 'url(' + spriteUrl + ')');
	
	//change counter colors
	var actionButton = $('button.ProfileTweet-actionButton.js-actionFavorite');
	var actionUndoButton = $('button.ProfileTweet-actionButtonUndo.js-actionFavorite');
	
	//change fave counter color
	var coloredCounter = actionUndoButton.find('div.IconTextContainer > span');
	coloredCounter.css('color', '#ffac33');

	//change hover state of gray counter
	var grayCounter = actionButton.find('div.IconTextContainer > span');
	grayCounter.hover(function(){
		$(this).css('color', '#ffac33');
	},
		function(){
		$(this).css('color', '#aab8c2');
	})

	//chage tooltip text
	actionButton.find('div.js-tooltip').attr('title', 'Favorite');
	actionUndoButton.find('div.js-tooltip').attr('title', 'Undo favorite');


	//change notification badge
	var starBadge = $('span.Icon--heartBadge');
	starBadge.addClass('star-badge');

	//change notification text
	var notifications = $('div.stream-item-activity-line');
	notifications.each(function(index){
		var origText = $(this).html();
		var newText = origText.replace("liked", "favorited");
		$(this).html(newText);
	})

	var showMoreBtns = $('button.view-all-supplements');
	showMoreBtns.each(function(){
		var origText = $(this).html();
		var newText = origText.replace("likes", "favorites");
		$(this).html(newText);
	})
}

function favToast(){
	//change notification badge
	var starBadge = $('span.Icon--heartBadge');
	starBadge.addClass('star-badge');
	
	var toastElements = $('.WebToast-contentBox');
	if (toastElements != undefined){
		//change text on header
		var toastHeader = toastElements[0];
		var origText = $(toastHeader).html();
		var newText = origText.replace("Liked", "Favorited");
		$(toastHeader).html(newText);

		//change text on body text
		var toastText = toastElements[1];
		var origText = $(toastText).html();
		var newText = origText.replace("liked", "favorited");
		$(toastText).html(newText);
	}
}
