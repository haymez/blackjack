/**
 * This file handles the logic behind the game
 */

//Global Variables
var cards = new Array();

for(var i = 0; i < 13; i++) {
	cards.push(new card(i+2, i*4));
	cards.push(new card(i+2, i*4+1));
	cards.push(new card(i+2, i*4+2));
	cards.push(new card(i+2, i*4+3));
}

//card object
function card(points, number) {
	this.number = number;
	if(points < 11) this.points = points
	else if(points >= 11 &&  points < 14) this.points = 10;
	else this.points = 11;
}

function newGame() {
	var c = confirm("Are you sure you wish to begin a new game?")
	if(c) $("#content").empty().append("\
		<h3 class='Centered'>BlackJack 21</h3>\
		<div class='dealer'></div>\
		<div class='player'></div>");
}