/*
 * This file contains the model for the game 
 */

var numDecks = 7;
var game;
var cards = [];

for(var j = 0; j < numDecks; j++) {
	for(var i = 0; i < 13; i++) {
		cards.push(new card(i+2, i*4));
		cards.push(new card(i+2, i*4+1));
		cards.push(new card(i+2, i*4+2));
		cards.push(new card(i+2, i*4+3));
	}
}

//Model for game
var newGame = function() {
	return {
		dealer : createPlayer(),
		players: [],
		deck: [],
		deal: function() {
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
		},
		dealCard: function() {
			var index = Math.floor(Math.random()*this.deck.length);
			var card = this.deck[index];
			this.deck.splice(index, 1);
			currentPlayer().hit(card);
			return card;
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
		game = newGame();
		game.deck = cards.slice(0);
		game.players.push(createPlayer(1000));

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