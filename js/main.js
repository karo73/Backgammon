'use strict';

function Backgammon(){
	
	this.startPuckPlaces = {
		1  : { type  : 'white', count : 2 },
		6  : { type  : 'black', count : 5 },
		8  : { type  : 'black', count : 3 },
		12 : { type  : 'white', count : 5 },
		13 : { type  : 'black', count : 5 },
		17 : { type  : 'white', count : 3 },
		19 : { type  : 'white', count : 5 },
		24 : { type  : 'black', count : 2 }
	};
	this.diceWidth = 50;
	this.dice1 = null;
	this.dice2 = null;
	this.black = 'black';
	this.white = 'white';
	this.playerTurnCount = 0;
	this.turn = this.white; // Default whites start
	this.dicesIsReversed = false;
	this.resetSteps = [];
	
}

Backgammon.prototype.getRandNumber = function(){
	return Math.ceil( Math.random() * 6 );
}

Backgammon.prototype.getElementById = function( id ){
	return document.getElementById( id );
}

Backgammon.prototype.initDice = function(){
	
	var dice1 = this.getElementById( 'dice-1' ),
		dice2 = this.getElementById( 'dice-2' );
	
	this.dice1 = this.getRandNumber();
	this.dice2 = this.getRandNumber();
	
	dice1.style = '';
	dice2.style = '';
	dice1.style.backgroundPosition = '-' + ( ( this.dice1 - 1 ) * this.diceWidth ) + 'px top';
	dice2.style.backgroundPosition = '-' + ( ( this.dice2 - 1 ) * this.diceWidth ) + 'px top';
	
}

Backgammon.prototype.getPuck = function( type ){
	return '<button class="puck' + ( type === 'black' ? ' puck-black' : '' ) + '" type="button" data-type="' + type + '"></button>';
};

Backgammon.prototype.drawPucks = function(){
	
	for ( var i in this.startPuckPlaces ) {
		
		var stepBox = this.getElementById( 'step-' + i );
		
		for ( var j = 0, jl = this.startPuckPlaces[i]['count']; j < jl; j++ ) {
			
			stepBox.innerHTML += this.getPuck( this.startPuckPlaces[i]['type'] );
			
		}
		
	}
	
};

Backgammon.prototype.setTransparencyForCurrentDice = function(){
	
	switch ( true ) {
		case
			( 0 < this.playerTurnCount && this.dice1 !== this.dice2 && !this.dicesIsReversed ) ||
			( 1 < this.playerTurnCount && this.dice1 === this.dice2 && !this.dicesIsReversed ) :
			this.getElementById('dice-1').style.opacity = .5;
			break;
		case
			( 0 < this.playerTurnCount && this.dice1 !== this.dice2 && this.dicesIsReversed ) ||
			( 1 < this.playerTurnCount && this.dice1 === this.dice2 && this.dicesIsReversed ) :
			this.getElementById('dice-2').style.opacity = .5;
			break;
		default:
	}
	
};

Backgammon.prototype.getGoToElem = function( elemType, id ){
	
	if ( elemType === this.white ) {
		
		id = ( this.playerTurnCount < 3 ) ? ( id + this['dice' + this.playerTurnCount] ) : ( id + this.dice1 );
		
	} else {
		
		id = ( this.playerTurnCount < 3 ) ? ( id - this['dice' + this.playerTurnCount] ) : ( id - this.dice1 );
		
	}
	
	return this.getElementById( 'step-' + id );
	
};

Backgammon.prototype.puckGo = function( elemType, clickedButton ){
	
	var id = Number( clickedButton.parentNode.id.replace('step-', '') ),
		elem = this.getGoToElem( elemType, id );
	
	this.setResetSteps( id, elemType );
	this.setTransparencyForCurrentDice();
	elem.innerHTML += this.getPuck( elemType );
	this.clickEvents( elem );
	
};

Backgammon.prototype.setResetSteps = function( id, elemType ){
	
	this.resetSteps.push({
		from: id,
		to: ( elemType === this.white ) ? id + ( this.playerTurnCount < 3 ? this['dice' + this.playerTurnCount] : this.dice1 ) :
										  id - ( this.playerTurnCount < 3 ? this['dice' + this.playerTurnCount] : this.dice1 ),
		type: elemType
	});
	
};

Backgammon.prototype.afterClick = function( $this, self ){
	
	var elemType = $this.getAttribute('data-type'),
		stepCount = 2,
		diceBox = document.getElementsByClassName('dice-box')[0];
	
	if ( self.dice1 === self.dice2 ) {
		stepCount = 4;
	}
	
	if ( self.turn === elemType ) {
		
		self.playerTurnCount++;
		
		var elem = self.getGoToElem( elemType, Number( $this.parentNode.id.replace('step-', '') ) ),
			pucks = elem.getElementsByClassName('puck');
		
		if ( !elem || ( pucks.length > 1 && pucks[0].getAttribute('data-type') !== elemType ) ) {
			self.playerTurnCount--;
			return;
		}
		
		self.puckGo( elemType, $this );
		
		$this.parentNode.removeChild( $this );
		
		if ( self.playerTurnCount === stepCount ) {
			
			if ( elemType === self.black ) {
				self.turn = self.white;
				diceBox.className = 'dice-box';
			} else {
				self.turn = self.black;
				diceBox.className = 'dice-box on-right';
			}
			
			self.playerTurnCount = 0;
			self.dicesIsReversed = false;
			self.resetSteps = [];
			self.initDice();
		
		}
		
	}
	
};

Backgammon.prototype.toggleDiceReverse = function(){
	
	var self = this;
	
	document.getElementsByClassName('reverse-btn')[0].onclick = function(){
		
		if ( self.playerTurnCount ) {
			alert( 'Hey you can\'t do reverse, you\'re already played one.' );
			return;
		}
		
		var diceBox = document.getElementsByClassName('dice-box')[0];
		
		if ( self.dicesIsReversed ) {
			
			self.dicesIsReversed = false;
			diceBox.className = 'dice-box';
			
		} else {
			
			self.dicesIsReversed = true;
			diceBox.className = 'dice-box dice-box--reverse';
			
		}
		
		if ( self.turn === 'black' ) {
			diceBox.className += ' on-right';
		}
		
		var temp = self.dice1;
		
		self.dice1 = self.dice2;
		self.dice2 = temp;
		
	};
	
};

Backgammon.prototype.clickEvents = function( elem ){
	
	var self = this,
		pucks = elem.getElementsByClassName('puck');

	for ( var i = 0, l = pucks.length; i < l; i++ ) {
		//pucks[i].removeEventListener('click', function(){}, false);
		pucks[i].onclick = function(){
			self.afterClick( this, self );
		};
	}
	
};

Backgammon.prototype.resetStep = function(){
	
	var self = this;
	
	self.getElementById('reset-step').onclick = function(){
		
		var l = self.resetSteps.length;
		
		if ( l ) {
			
			var lastElem = self.resetSteps[l-1],
				lastElemPucks = self.getElementById('step-' + lastElem.to).getElementsByClassName('puck');
			
			lastElemPucks[lastElemPucks.length-1].parentNode.removeChild( lastElemPucks[lastElemPucks.length-1] );
			self.getElementById('step-' + lastElem.from).innerHTML += self.getPuck( lastElem.type );
			self.clickEvents( self.getElementById('step-' + lastElem.from) );
			self.playerTurnCount--;
			
			self.resetSteps.pop();
			
			l = self.resetSteps.length;
			
			if ( !l || self.dice1 === self.dice2 && self.playerTurnCount < 2 ) {
				self.getElementById( 'dice-1' ).style.opacity = 1;
				self.getElementById( 'dice-2' ).style.opacity = 1;
			}
			
			if ( !l ) {
				self.playerTurnCount = 0;
			}
			
		}
		
	};
	
};

Backgammon.prototype.init = function(){
	
	this.drawPucks();
	
	this.initDice();
	
	this.clickEvents( document );
	
	this.toggleDiceReverse();
	
	this.resetStep();
	
};

var $backgammon = new Backgammon();

$backgammon.init();


