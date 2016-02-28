if(typeof zmr !== 'object'){
	var zmr = {};
}

zmr.masterCardDeck = ['blueDino',  'blueDino', 'brownDino', 'brownDino', 'redDino', 'redDino', 'greenDino', 'greenDino', 'purpDino', 'purpDino'];

zmr.dinoGame = (function(jQ) {
	var score;
	var cardsmatched;
	
	var ui = jQ("#gameUI");
	var uiIntro = jQ("#gameIntro");
	var uiStats = jQ("#gameStats");
	var uiComplete = jQ("#gameComplete");
	var uiCards= jQ("#cards");
	var uiReset = jQ(".gameReset");
	var uiScore = jQ(".gameScore");
	var uiPlay = jQ("#gamePlay");
	var uiTimer = jQ("#timer");
	
	var cardDeck = zmr.masterCardDeck.slice(0); // Clone the deck

	var init = function(){
		uiComplete.hide();
		uiCards.hide();
		playGame = false;
		uiPlay.click(function(e) {
			e.preventDefault();
			uiIntro.hide();
			startGame();
		});
				
		uiReset.click(function(e) {
			e.preventDefault();
			//alert("just here");
			uiComplete.hide();					
			reStartGame();
		});
	}
	
	var startGame = function(){
		uiTimer.show();
		uiScore.html("0 seconds");
		uiStats.show();
		uiCards.show();
		score = 0;
		cardsmatched = 0;
			 if (playGame == false) {
			   		playGame = true;
					cardDeck.sort(shuffle);
					
					for(var i=0;i<zmr.masterCardDeck.length - 1;i++){
						jQ(".card:first-child").clone().appendTo("#cards");
					}
					
					// initialize each card's position
					uiCards.children().each(function(index) {
						
						// align the cards to be 5x2 ourselves.
						jQ(this).css({
									"left" : (jQ(this).width() + 20) * (index % 5),
									"top" : (jQ(this).height() + 20) * Math.floor(index / 5)
								});
								// get a pattern from the shuffled deck
								var pattern = cardDeck.pop();
								
								// visually apply the pattern on the card's back side.
								jQ(this).find(".back").addClass(pattern);
								
								// embed the pattern data into the DOM element.
								jQ(this).attr("data-pattern",pattern);
								
								// listen the click event on each card DIV element.
								jQ(this).click(selectCard);
							});											 
				   	timer();
				};			   
	}
	
	var timer = function (){
		//alert("timer set")
				if (playGame) {
					scoreTimeout = setTimeout(function() {
						uiScore.html(++score + " seconds");		
						timer();
					}, 1000);
				};
	}
	
	var shuffle = function(){
		return 0.5 - Math.random();
	}
	
	var selectCard = function(){
		// we do nothing if there are already two card flipped.
		if (jQ(".card-flipped").size() > 1) {
			return;
		}
		jQ(this).addClass("card-flipped");
		
		// check the pattern of both flipped card 0.7s later.
		if (jQ(".card-flipped").size() == 2) {
			setTimeout(checkPattern,700);
		}
	}
	
	var checkPattern = function(){
		if (isMatchPattern()) {
			$(".card-flipped").removeClass("card-flipped").addClass("card-removed");
				if(document.webkitTransitionEnd){
					$(".card-removed").bind("webkitTransitionEnd",	removeTookCards);
				}else{
					removeTookCards();
				}
			} else {
			$(".card-flipped").removeClass("card-flipped");
		}
	}
	
	var isMatchPattern = function(){
		var cards = jQ(".card-flipped");
		var pattern = jQ(cards[0]).data("pattern");
		var anotherPattern = jQ(cards[1]).data("pattern");
		return (pattern == anotherPattern);
	}
	
	var removeTookCards = function(){
		var cardsToMatch = (zmr.masterCardDeck.length / 2);
		if (cardsmatched < cardsToMatch - 1){
			cardsmatched++;
			jQ(".card-removed").remove();
		}else{
			jQ(".card-removed").remove();
			uiCards.hide();
			uiComplete.show();
			clearTimeout(scoreTimeout);
		}	
	}
	
	var reStartGame = function(){
		playGame = false;
		uiCards.html("<div class='card'><div class='face front'></div><div class='face back'></div></div>");
		clearTimeout(scoreTimeout);
		cardDeck = zmr.masterCardDeck.slice(0); // Clone the deck
		startGame();
	}

	return {
		init: init
	}
	
}(jQuery));

jQuery(function(){
	zmr.dinoGame.init();
});