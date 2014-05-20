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
var bank = 1000;
var bet = 10;

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

/* newRound - This function starts a new round of Blackjack
 * @param  {Boolean} newGame - If True, user will be prompted if they really want to start new game
 *                             If False, a new round will be started
 */
function newRound(newGame) {
	var c = false;
	if(newGame) {
		c = confirm("Are you sure you wish to begin a new game?");
	}
	if(c || !newGame) {
		$("#content").empty().append("\
		<h1 class='Centered noPad faded'>BlackJack</h1>\
		\
		<div class='dealer Centered'>\
			<h4 class='Centered faded'>Dealer</h4>\
			<div id='dealer' class='cards'></div>\
			<div id='dealerInfo' class='game-info well'>\
				<h3>Points: 0</h3>\
			</div>\
		</div>\
		\
		<div class='player Centered'>\
			<h4 class='Centered faded'>Player</h4>\
			<div id= 'player' class='cards'></div>\
			<div id='playerInfo' class='game-info well'>\
				<h3>0</h3>\
			</div>\
		</div>\
		\
		<div class='controls Centered'>\
			<h4 class='Centered faded'>Player Controls</h4>\
			<div style='margin-bottom:5px;'>\
				<div id='bank' class='bank'></div>\
				<button id='dealButton' class='btn btn-lg btn-success buttons' onclick='deal();'>Deal</button>\
				<button id='hitButton' class='btn btn-lg btn-primary buttons' onclick='hitMe();'>Hit</button>\
				<button id='standButton' class='btn btn-lg btn-warning buttons' onclick='stand();'>Stand</button>\
			</div>\
		</div>");

		//Reinitialize variables to starting states
		deck = 0;
		deck = cards.slice(0);
		playerCards = new Array();
		dealerCards = new Array();
		playerHandNum = 0;
		dealerAces = 0;
		playerAces = 0;
		dealerPoints = 0;
		playerPoints = 0;
		updateCount(false); //update player points
		updateBank(); //Update players funds
		buttonState(true, false, false);
		if(!newGame) {
			deal();
		}
	}
	if(newGame) {
		//reset bets and current 
	}
}

//Handles dealing two cards to each player
function deal() {
	if(dealerPoints == 0) {
		buttonState(false, false, false);
		var i = 0;
		var delay = setInterval(function() {
			if(i%2 == 0) dealCard("player", getNewCard());
			else {
				dealCard("dealer", getNewCard());
			}
			i++;
			if(i == 4) {
				clearInterval(delay);
				buttonState(false, true, true);
			}
		}, 500)
	} else {
		newRound(false);
	}
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
		if(cardObj.points == 11) playerAces++;
	} else {	
		if(dealerCards.length > 0)	
			$("<img id='dealer"+(dealerCards.length)+"' style='display:none;' src=images/" + (52-cardObj.number) + ".png></img>").appendTo("#dealer").fadeIn(500);
		else
			$("<img id='dealer"+(dealerCards.length)+"' style='display:none;' src=images/b2fv.png></img>").appendTo("#dealer").fadeIn(500);
		dealerCards.push(cardObj);
		if(cardObj.points == 11) dealerAces++;
	}
	updateCount(false);
}

//Deals the player one more card
function hitMe() {
	dealCard("player", getNewCard());
}

function stand() {
	buttonState(false, false, false);
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
		dealerDiv.empty().append("<h3>Points: " + dealerPoints + "</h3>");
		//dealer has busted
		if(dealerPoints > 21) {
			//Make sure player doesn't have any aces that can change to 1 point value
			if(dealerAces > 0) {
				dealerAces--;
				for(var i = 0; i < dealerCards.length; i++) {
					if(dealerCards[i].points == 11) {
						dealerCards[i].points = 1;
						break;
					}
				}
				updateCount(true);
			} else {
				messageOverlay("dealer", "Bust!");
				buttonState(true, false, false);
				endRound(evaluate());
			}
		}
	}
	playerDiv.empty().append("<h3>Points: " + playerPoints + "</h3>");
	//player has busted
	if(playerPoints > 21) {
		//Make sure player doesn't have any aces that can change to 1 point value
		if(playerAces > 0) {
			playerAces--;
			for(var i = 0; i < playerCards.length; i++) {
				if(playerCards[i].points == 11) {
					playerCards[i].points = 1;
					break;
				}
			}
			updateCount(false);
		} else {
			$("#dealer0").attr("src", "images/" + (52-dealerCards[0].number) + ".png")
			$("#dealerInfo").empty().append("<h3>" + dealerPoints + "</h3>")
			messageOverlay("player", "Bust!");
			buttonState(true, false, false);
			endRound(evaluate());
		}
	}
	if(playerPoints == 21 && playerCards.length == 2 && dealerPoints < 21) $("#standButton").trigger("click");
}

//Handles logic for the dealer choosing to hit or stand
function dealer() {
	updateCount(true);
	$("#dealer0").attr("src", "images/" + (52-dealerCards[0].number) + ".png")
	if(dealerPoints < 17) {
		var delay = setInterval(function() {
			dealCard("dealer", getNewCard());
			updateCount(true);
			if(dealerPoints >= 17) {
				clearInterval(delay);
				endRound(evaluate());
			}
		}, 1000)
	} else endRound(evaluate());
}

/* messageOverlay - Handles overlaying messages on specified players mat for a temporary period of time
 * @param  {String} name    - Name of player
 * @param  {String} message - Message to display
 */
function messageOverlay(name, message) {
	if(name == "player") {
		$(".player").append("<h1 class='small-temp'>" + message + "</h1>");
		setTimeout(function() { $(".small-temp").fadeOut(1000); }, 1000);
		setTimeout(function() { $(".small-temp").remove(); }, 2000);
	} else if(name == "dealer") {
		$(".dealer").append("<h1 class='small-temp'>" + message + "</h1>");
		setTimeout(function() { $(".small-temp").fadeOut(1000); }, 1000);
		setTimeout(function() { $(".small-temp").remove(); }, 2000);
	} else if(name == "large") {
		$("#content").append("<h1 class='large-temp'>" + message + "</h1>");
		setTimeout(function() { $(".large-temp").fadeOut(2000); }, 1000);
		setTimeout(function() { $(".large-temp").remove(); }, 3000);
	}
}

/* buttonState - Activates / deactivates butons based on booleans provided
 * @param  {Boolean} deal  - If false, this button will be disabled. If True, it will be enabled.
 * @param  {Boolean} hit   - If false, this button will be disabled. If True, it will be enabled.
 * @param  {Boolean} stand - If false, this button will be disabled. If True, it will be enabled.
 * @return {[type]}       [description]
 */
function buttonState(deal, hit, stand) {
	if($("#dealButton").is(":hidden") && deal) $("#dealButton").show(500);
	else if(!deal) $("#dealButton").hide(500);
	if($("#hitButton").is(":hidden") && hit) $("#hitButton").show(500);
	else if(!hit) $("#hitButton").hide(500);
	if($("#standButton").is(":hidden") && stand) $("#standButton").show(500);
	else if(!stand) $("#standButton").hide(500);
}

/* evaluate - Returns 0 if dealer won the round, 1 if player one, 2 if push
 * @return {Boolean} - Boolean that determines who won the round
 */
function evaluate() {
	if(playerPoints > 21) return 0;
	if(dealerPoints > 21) return 1;
	if(dealerPoints == playerPoints) return 2;
	if(dealerPoints > playerPoints) return 0;
	else return 1;
}

/* endRound - Handles what happens at the end of a round
 * @param  {Boolean} eval - If true, dealer has won the round. If false, player has won round.
 */
function endRound(eval) {
	if(eval == 0) {
		messageOverlay("large", "Dealer Wins!");
		bank -= bet;
	} else if(eval == 1) {
		if(playerPoints == 21 && playerCards.length == 2) {
			messageOverlay("large", "Player gets a Natural!");
			bank += bet*1.5;
		}
		else {
			messageOverlay("large", "Player Wins!");
			bank += bet;
		}
	} else {
		messageOverlay("large", "Push!");
	}
	updateBank();
	buttonState(true, false, false);
}

//Updates the players funds
function updateBank() {
	var playerBank = $("#bank");
	playerBank.empty().append("<h2>Bet: $" + bet + ".  Funds: $" + bank + "</h2>")
}