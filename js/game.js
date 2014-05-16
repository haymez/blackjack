/**
 * This file handles the logic behind the game
 */

//Global Variables
var cards = new Array(); //Holds all the cards and their point values
var deck; //remove cards from this deck as you use them
var playerHandNum = 0; //Keeps track of how many cards player has
var dealerCards = new Array(); //Holds the card objects for dealer
var playerCards = new Array(); //Holds the card objects for player
var dealerPoints = 0;
var dealerPoints = 0;
var dealerAces = 0;
var playerAces = 0;

for(var i = 0; i < 13; i++) {
	cards.push(new card(i+2, i*4));
	cards.push(new card(i+2, i*4+1));
	cards.push(new card(i+2, i*4+2));
	cards.push(new card(i+2, i*4+3));
}

deck = cards;

/* card - Structure for card object
 * @param  {Number} points - The point value of the current card
 * @param  {Number} number - This card's position in the deck
 */
function card(points, number) {
	this.number = number;
	if(points < 11) this.points = points
	else if(points >= 11 &&  points < 14) this.points = 10;
	else this.points = 11;
}

//This function starts a new game of Blackjack
function newGame() {
	var c = confirm("Are you sure you wish to begin a new game?")
	if(c) {
		$("#content").empty().append("\
		<h2 class='Centered noPad'>BlackJack</h2>\
		\
		<div class='dealer Centered'>\
			<h4 class='Centered'>Dealer</h4>\
			<div id='dealer' class='cards'></div>\
			<div id='dealerInfo' class='game-info well'>\
				<h3>0</h3>\
			</div>\
		</div>\
		\
		<div class='player Centered'>\
			<h4 class='Centered'>Player</h4>\
			<div id= 'player' class='cards'></div>\
			<div id='playerInfo' class='game-info well'>\
				<h3>0</h3>\
			</div>\
		</div>\
		\
		<div class='controls Centered'>\
			<h4 class='Centered'>Player Controls</h4>\
			<div class='btn-group' style='margin-bottom:5px;'>\
				<button class='btn btn-lg btn-success' onclick='deal();'>Deal</button>\
				<button class='btn btn-lg btn-primary' onclick='hitMe();'>Hit</button>\
				<button class='btn btn-lg btn-warning' onclick='stand();'>Stand</button>\
			</div>\
		</div>");

		//Reinitialize variables to starting states
		deck = cards;
		playerCards = new Array();
		dealerCards = new Array();
		playerHandNum = 0;
		dealerAces = 0;
		playerAces = 0;
		dealerPoints = 0;
		playerPoints = 0;
		updateCount(false); //update player points
	}
}

//Handles dealing two cards to each player
function deal() {
	var i = 0;
	var delay = setInterval(function() {
		if(i%2 == 0) dealCard("player", getNewCard());
		else {
			dealCard("dealer", getNewCard());
		}
		i++;
		if(i == 4) clearInterval(delay);
	}, 500)
}

/* dealCard - Handles dealing a single card to a specified player
 * @param  {String} name    - Name of player to deal to (Either "dealer" or "player")
 * @param  {Object} cardObj - Card Object that contains card points, and position in deck.
 */
function dealCard(name, cardObj) {
	if(name == "player") {
		$("<img id='player"+(playerHandNum)+"' style='display:none;' src=images/" + (52-cardObj.number) + ".png></img>").appendTo("#player").fadeIn(500);
		playerCards.push(cardObj);
		playerHandNum++;
		playerAces++;
	} else {	
		if(dealerCards.length > 0)	
			$("<img id='dealer"+(dealerCards.length)+"' style='display:none;' src=images/" + (52-cardObj.number) + ".png></img>").appendTo("#dealer").fadeIn(500);
		else
			$("<img id='dealer"+(dealerCards.length)+"' style='display:none;' src=images/b2fv.png></img>").appendTo("#dealer").fadeIn(500);
		dealerCards.push(cardObj);
		dealerAces++;
	}
	updateCount(false);
}

//Deals the player one more card
function hitMe() {
	dealCard("player", getNewCard());
}

function stand() {
	dealer();
}

/* getNewCard - Returns a pseudo random card object that hasn't been used yet
 * @return {Object/Boolean} - Card object that hasn't been used yet. If no cards remain, False is returned.
 */
function getNewCard() {
	if(deck.length > 0) {
		var index = Math.floor(Math.random()*deck.length);
		var obj = deck[index];
		deck.splice(index, 1);
		return obj;
	}
	else return false;
}

/* updateCount - Updates the number of points player has. if updateDealer is true, dealer is also updated
 * @param  {Boolean} updateDealer - If True, dealer's points will also be updated.
 *                                	If False, only Player is updated.
 */
function updateCount(updateDealer) {
	var dealerDiv = $("#dealerInfo");
	var playerDiv = $("#playerInfo");
	dealerPoints = 0;
	playerPoints = 0;
	for(var i = 0; i < dealerCards.length; i++) {
		dealerPoints += dealerCards[i].points;
	}
	for(var i = 0; i < playerCards.length; i++) {
		playerPoints += playerCards[i].points;
	}
	if(updateDealer) {
		dealerDiv.empty().append("<h3>" + dealerPoints + "</h3>");
		//dealer has busted
		if(dealerPoints > 21) {
			bust("dealer");
		}
	}
	playerDiv.empty().append("<h3>" + playerPoints + "</h3>");
	//player has busted
	if(playerPoints > 21) {
		bust("player");
	}
}

//Handles logic for the dealer choosing to hit or stand
function dealer() {
	updateCount(true);
	$("#dealer0").attr("src", "images/" + (52-dealerCards[0].number) + ".png")
	if(dealerPoints < 17) {
		var delay = setInterval(function() {
			dealCard("dealer", getNewCard());
			updateCount(true);
			if(dealerPoints >= 17) clearInterval(delay);
		}, 1000)
	}
}

/* bust - Handles when players or dealer bust
 * @param  {String} name - name of player ("player" or "dealer")
 */
function bust(name) {
	$("#dealer0").attr("src", "images/" + (52-dealerCards[0].number) + ".png")
	$("#dealerInfo").empty().append("<h3>" + dealerPoints + "</h3>")
	if(name == "player") {
		var playerDiv = $(".player");
		playerDiv.append("<h1 class='temp'>Bust!</h1>");
		setTimeout(function() { $(".temp").fadeOut(1000); }, 1000);
	} else {
		var dealerDiv = $(".dealer");
		dealerDiv.append("<h1 class='temp'>Bust!</h1>");
		setTimeout(function() { $(".temp").fadeOut(1000); }, 1000);
	}
	setTimeout(function() { $(".temp").remove(); }, 2000);
}