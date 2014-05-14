/**
 * This file handles the logic behind the game
 */

//Global Variables
var cards = new Array(); //Holds all the cards and their point values
var deck; //remove cards from this deck as you use them
var dealerHand = 0; //Keeps track of how many cards dealer has
var playerHand = 0; //Keeps track of how many cards player has
var dealerCards = new Array(); //Holds the card objects for dealer
var playerCards = new Array(); //Holds the card objects for player

for(var i = 0; i < 13; i++) {
	cards.push(new card(i+2, i*4));
	cards.push(new card(i+2, i*4+1));
	cards.push(new card(i+2, i*4+2));
	cards.push(new card(i+2, i*4+3));
}

deck = cards;

//card object. points is how much the card is worth. number is its position in the deck
function card(points, number) {
	this.number = number;
	if(points < 11) this.points = points
	else if(points >= 11 &&  points < 14) this.points = 10;
	else this.points = 11;
}

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
			<div id='playerInfo' class='game-info well'></div>\
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
		deck = cards;
		playerHand = new Array();
		dealerHand = new Array();
		dealerHand = 0;
		playerHand = 0;
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

function dealCard(name, cardObj) {
	if(name == "player") {
		$("<img id='player"+(playerHand)+"' style='display:none;' src=images/" + (52-cardObj.number) + ".png></img>").appendTo("#player").fadeIn(500);
		playerCards.push(cardObj);
		playerHand++;
	} else {	
		if(dealerHand > 0)	
			$("<img id='dealer"+(dealerHand)+"' style='display:none;' src=images/" + (52-cardObj.number) + ".png></img>").appendTo("#dealer").fadeIn(500);
		else
			$("<img id='dealer"+(dealerHand)+"' style='display:none;' src=images/b2fv.png></img>").appendTo("#dealer").fadeIn(500);
		dealerCards.push(cardObj);
		dealerHand++;
	}
	updateCount(false);
}

function hitMe() {
	dealCard("player", getNewCard());
}

function stand() {

}

//Returns a random card that hasn't been used yet
function getNewCard() {
	if(deck.length > 0) {
		var index = Math.floor(Math.random()*deck.length);
		var obj = deck[index];
		deck.splice(index, 1);
		return obj;
	}
	else return false;
}

//Updates the number of points player has. if updateDealer is true, dealer is also updated
function updateCount(updateDealer) {
	var dealerDiv = $("#dealerInfo");
	var playerDiv = $("#playerInfo");
	var dealerPoints = 0;
	var playerPoints = 0;
	for(var i = 0; i < dealerCards.length; i++) {
		dealerPoints += dealerCards[i].points;
	}
	for(var i = 0; i < playerCards.length; i++) {
		playerPoints += playerCards[i].points;
	}
	if(updateDealer) dealerDiv.empty().append("<h3>" + dealerPoints + "</h3>");
	playerDiv.empty().append("<h3>" + playerPoints + "</h3>");
}

//Handles logic for dealer getting cards
function dealer() {
	while(dealerPoints < 17) {
		deal("dealer", getNewCard());
	}
}