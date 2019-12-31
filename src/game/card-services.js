const cardLogic = require('./card-logic');

let cardMethods = {
  hands: {
    player1: [],
    player2: [],
    player3: [],
    player4: []
  },
  suits: ['spades', 'clubs', 'diamonds', 'hearts'],
  cardNames: ['Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King', 'Ace', 'Two'],
  cards: [],
  generateCardValues: function(){
    for(let i = 0; i < this.suits.length; i++){
      for(let j = 0; j < 13; j++){
        this.cards.push([this.suits[i], j]);
      }}
    console.log(this.cards);
    return this.cards;
  },
  shuffle: function(array){
    return array.sort(()=> Math.random() - 0.5);
  },
  returnShuffledCards: function(){
    return this.shuffle(this.generateCardValues());
  },
  splitHands: function(){
    let cardsArray = this.returnShuffledCards();
    let counter = 0;
    for(let i=0; i < cardsArray.length; i++){
      if(counter === 0){
        this.hands.player1.push(cardsArray[i]);
        counter++;
      } else if(counter === 1){
        this.hands.player2.push(cardsArray[i]);
        counter++;
      } else if(counter === 2){
        this.hands.player3.push(cardsArray[i]);
        counter++;
      } else{
        this.hands.player4.push(cardsArray[i]);
        counter = 0;
      }
    }
    return this.hands.player1;
  },
  playerCounter: 2,
  nextMove: function(obj){
    //find next players hand
    // let {player2, player3, player4} = cardMethods.hands;
    // console.log(player2);
    // console.log(player3);
    // console.log(player4);
    console.log(cardMethods);
    let currentHand = this.hands[`player${this.playerCounter}`];
    let playedCard = currentHand.splice(0,1);
    console.log(cardMethods.hands);
    let returnObj = {playedCard, playerCounter: this.playerCounter, currentHand};

    this.playerCounter ++;
    if (this.playerCounter > 4){
      this.playerCounter = 1;
    }
    //use the object with two parameters that were sent, to determine what should be played next
    return returnObj;
    //splice next user's hand.
  },
  evaluatePlay: function(obj){
    return this.nextMove(obj);
  }
};

module.exports = cardMethods;