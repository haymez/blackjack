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
var debug = false; //Controls whether or not consoles will be displayed.
var dealerCalled = false; //changes to true once dealer() gets called once
var numDecks = 7;

for(var j = 0; j < numDecks; j++) {
	for(var i = 0; i < 13; i++) {
		cards.push(new card(i+2, i*4));
		cards.push(new card(i+2, i*4+1));
		cards.push(new card(i+2, i*4+2));
		cards.push(new card(i+2, i*4+3));
	}
}

var createPlayer = function(funds){
	return {
		hand: [],
		funds: funds,
		bet: 10,
		hasBusted: function() {
			return this.points() > 21;
		},
		points: function() {
			var points = 0;
			var aces = 0;
			for(var i = 0; i < this.hand.length; i++) {
				if(this.hand[i].points == 11) aces++;
				points += this.hand[i].points;
				if(points > 21 && aces > 0) {
					points -= 10;
					aces--;
				}
			}
			return points;
		},
		hit: function(card) {
			this.hand.push(card);
		}
	}
};

var newGame = function() {
	return {
		dealer : createPlayer(),
		players: [],
		deck: function() {
			var cards = [];

		},
		deal: function() {

		},
		dealCard: function() {

		},
		currentPlayerIndex: 0,
		currentPlayer: function() {
			if(this.currentPlayerIndex < this.players.length)
				return this.players[this.currentPlayerIndex];
			else
				return this.dealer;
		},
		nextPlayer: function() {
			this.currentPlayerIndex++;
			return this.currentPlayer();
		}

	}
}


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
	if(debug) console.log("newRound");
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
				<button id='incButton' class='btn btn-lg btn-info buttons' onclick='changeBet(5);'>+ Bet</button>\
				<button id='decButton' class='btn btn-lg btn-info buttons' onclick='changeBet(-5);'>- Bet</button>\
				<button id='insButton' class='btn btn-lg btn-default buttons' onclick='insurance();'>Insurance</button>\
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
		buttonState(true, false, false, true, true, false);
		dealerCalled = false;
		if(!newGame) {
			deal();
		}
	}
	//reset bets and current funds
	if(c == true) {
		bank = 1000;
		bet = 10;
		updateBank();
	}
}

//Handles dealing two cards to each player
function deal() {
	if(debug) console.log("deal");
	//Player does not have enough funds to play with this bet.
	if(bank < bet) {
		alert("You do not have enough funds to continue playing at current bet. Please start a new game " + 
			"or decrease your bet.");
		return;
	}
	if(dealerPoints == 0) {
		buttonState(false, false, false, false, false);
		var i = 0;
		var delay = setInterval(function() {
			if(i%2 == 0) dealCard("player", getNewCard());
			else {
				dealCard("dealer", getNewCard());
			}
			i++;
			if(i == 4) {
				clearInterval(delay);
				buttonState(false, true, true, false, false);
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
	if(debug) console.log("dealCard");
	if(name == "player") {
		$("<img id='player"+(playerHandNum)+"' style='display:none;' width='90px' src=images/" + (52-cardObj.number) + ".png></img>").appendTo("#player").fadeIn(500);
		playerCards.push(cardObj);
		playerHandNum++;
		if(cardObj.points == 11) playerAces++;
	} else {	
		if(dealerCards.length > 0)	
			$("<img id='dealer"+(dealerCards.length)+"' style='display:none;' width='90px' src=images/" + (52-cardObj.number) + ".png></img>").appendTo("#dealer").fadeIn(500);
		else
			$("<img id='dealer"+(dealerCards.length)+"' style='display:none;' width='90px' src=images/back.png></img>").appendTo("#dealer").fadeIn(500);
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
	buttonState(false, false, false, false, false);
	dealer();
}

/* getNewCard - Returns a pseudo random card object that hasn't been used yet
 * @return {Object/Boolean} - Card object that hasn't been used yet. If no cards remain, False is returned.
 */
function getNewCard() {
	if(debug) console.log("getNewCard");
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
	if(debug) console.log("UpdateCount");
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
		if(hasDealerBusted()) {
			messageOverlay("dealer", "Bust!");
			buttonState(true, false, false, true, true);
		}
		dealerDiv.empty().append("<h3>Points: " + dealerPoints + "</h3>");
		//dealer has busted
		if(dealerPoints > 21) {
			//Make sure dealer doesn't have any aces that can change to 1 point value
			if(dealerAces > 0 && dealerPoints < 32) {
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
				//buttonState(true, false, false, true, true);
				//endRound(evaluate());
			}
		}
	}
	playerDiv.empty().append("<h3>Points: " + playerPoints + "</h3>");
	//player has busted
	if(playerPoints > 21) {
		//Make sure player doesn't have any aces that can change to 1 point value
		if(playerAces > 0 && playerPoints < 32) {
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
			buttonState(true, false, false, true, true);
			endRound(evaluate());
		}
	}
	if(playerPoints == 21 && playerCards.length == 2 && dealerPoints < 21) $("#standButton").trigger("click");
}

//checks to see if dealer has busted
function hasDealerBusted() {
	if(dealerPoints > 21) {
		if(dealerAces > 0) {
			for(var i = 0; i < dealerCards.length; i++) {

			}
		}
	}
	return dealerPoints > 21;
}

//Handles logic for the dealer choosing to hit or stand
function dealer() {
	if(debug) console.log("dealer");
	if(dealerCalled == true) return; //Makes sure this is the first time this is being called this deal.
	dealerCalled = true;
	updateCount(true);
	$("#dealer0").attr("src", "images/" + (52-dealerCards[0].number) + ".png")
	if(dealerPoints < 17) {
		var delay = setInterval(function() {
			dealCard("dealer", getNewCard());
			updateCount(true);
			$("#dealerDiv").empty().append("<h3>Points: " + dealerPoints + "</h3>"); //update dealers points on screen
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
		$("#content").append("<h1 class='large-temp col-md-offset-4 col-sm-offset 4 col-xs-offset-3'>" + message + "</h1>");
		setTimeout(function() { $(".large-temp").fadeOut(2000); }, 1000);
		setTimeout(function() { $(".large-temp").remove(); }, 3000);
	}
}

/* buttonState - Activates / deactivates butons based on booleans provided
 * @param  {Boolean} deal  - If false, this button will be disabled. If True, it will be enabled.
 * @param  {Boolean} hit   - If false, this button will be disabled. If True, it will be enabled.
 * @param  {Boolean} stand - If false, this button will be disabled. If True, it will be enabled.
 * @param  {Boolean} inc - If false, this button will be disabled. If True, it will be enabled.
 * @param  {Boolean} dec - If false, this button will be disabled. If True, it will be enabled.
 * @return {[type]}       [description]
 */
function buttonState(deal, hit, stand, inc, dec, ins) {
	updateDealButton(deal);
	updateHitStandButtons(hit);
	updateIncDecButtons(inc);
	updateInsButton(ins);
}

//updates deal button
function updateDealButton(visible) {
	$("#dealButton").toggle(visible);
}

//updates hit and stand
function updateHitStandButtons(visible) {
	$("#hitButton").toggle(visible);
	$("#standButton").toggle(visible);
}

//updates inc and dec buttons
function updateIncDecButtons(visible) {
	$("#incButton").toggle(visible);
	$("#decButton").toggle(visible);
}

//updates insurance button
function updateInsButton(visible) {
	$("#insButton").toggle(visible);
}

/* evaluate - Returns 0 if dealer won the round, 1 if player one, 2 if push
 * @return {Boolean} - Boolean that determines who won the round
 */
function evaluate() {
	if(debug) console.log("evaluate");
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
	if(debug) console.log("endRound");
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
	buttonState(true, false, false, true, true);
}

//Updates the players funds on screen
function updateBank() {
	if(debug) console.log("updateBank");
	var playerBank = $("#bank");
	playerBank.empty().append("<h2>Bet: $" + bet + ".  Funds: $" + bank + "</h2>")
}

/* changeBet - changes the bet by value
 * @param  {Number} value - The amount to change bet (5 would add 5 to bet. -5 would take 5 away.)
 */
function changeBet(value) {
	if(debug) console.log("changeBet");
	if(bet+value <= bank && bet+value >  0) {
		bet += value;
		updateBank();
	}
}