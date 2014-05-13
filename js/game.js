/**
 * This file handles the logic behind the game
 */

//Global Variables
var cards = new Array();

for(var i = 0; i < 13; i++) {
	cards.push(new card(i+2, "diamonds"));
	cards.push(new card(i+2, "hearts"));
	cards.push(new card(i+2, "spades"));
	cards.push(new card(i+2, "clubs"));
}

//card object
function card(value, suit) {
	this.value = value;
	this.suit = suit;
	value < 10 ? this.points = value : this.points = 10;
}

function newGame() {
	var c = confirm("Are you sure you wish to begin a new game?")
	if(c) $("#content").empty().append("");
}