//run script when page is loaded or tab changes
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	//add styles we'll use later
	$('head').append('<style>.Icon--star-badge:before{content:"\\2605" !important; color: #ffac33 !important;} .ProfileTweet-action--favorite:hover .ProfileTweet-actionCount{color:#ffac33 !important;} .favorited .ProfileTweet-action--favorite .ProfileTweet-actionButtonUndo{color: #ffac33 !important;}</style>');
	
	//run function on inital content
	favStream();
	
	//set observer to run function when new tweets are added to the stream
	var streamContainer = document.getElementsByClassName('stream-items')[0];
	var mainObserver = new MutationObserver(function(mutations) {
		console.log('tweets added');
		favStream();
	  });    
	var config = { attributes: true, childList: true, characterData: true };
	mainObserver.observe(streamContainer, config);

	//set observer to watch for changes to body classes-- profile page, modals
	var body = document.body;
	var bodyObserver = new MutationObserver(function(mutations) {
		console.log('body class change');
		favStream();
	  });    
	var config = { attributes: true, childList: false, characterData: false };
	bodyObserver.observe(body, config);

});


function favStream(){
	console.log('fav forever!');
	//change heart button to star
	var spriteUrl = chrome.extension.getURL('assets/starsprite-outline.png');
	var animation = $('.HeartAnimation');
	animation.css('background-image', 'url(' + spriteUrl + ')');
	
	//chage tooltip text
	var actionButton = $('button.ProfileTweet-actionButton.js-actionFavorite');
	var actionUndoButton = $('button.ProfileTweet-actionButtonUndo.js-actionFavorite');
	actionButton.find('div.js-tooltip').attr('title', 'Favorite');
	actionUndoButton.find('div.js-tooltip').attr('title', 'Undo favorite');

	//change notification badge
	var starBadge = $('span.Icon--heartBadge');
	starBadge.removeClass('Icon--heartBadge')
	starBadge.addClass('Icon--star-badge');

	//change notification text
	var contexts = $('div.tweet-context');
	contexts.each(function(index){
		var origText = $(this).html();
		var newText = origText.replace("liked", "favorited");
		$(this).html(newText);
	})

	//change notification text
	var notifications = $('div.ActivityItem-displayText');
	notifications.each(function(index){
		var origText = $(this).html();
		var newText = origText.replace("liked", "favorited");
		$(this).html(newText);
	})

	if ( $('body').hasClass('overlay-enabled') ) {
		var likerList = $('a.request-favorited-popup');
		likerList.each(function(){
			var origText = $(this).html();
			var newText = origText.replace("Likes", "Favorites");
			$(this).html(newText);
		})
	}
	
	// for profile header
	if ( $('body').hasClass('ProfilePage') ) {
		var profCount = $('.ProfileNav-item--favorites, #content-main-heading');
		profCount.each(function(){
			var origText = $(this).html();
			var newText = origText.replace("Likes", "Favorites");
			$(this).html(newText);
		});
	}

	// For modals that show a list of favoriters
	if ( $('body').hasClass('modal-enabled') ) {
		setTimeout(
			function(){
				var modalHead = $('#activity-popup-dialog-header')[0];
				var origText = $(modalHead).html();
				var newText = origText.replace("Liked", "Favorited");
				$(modalHead).html(newText);
			},
			500
		);
	}

}
