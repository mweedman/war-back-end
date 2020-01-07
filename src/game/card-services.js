let cardMethods = {
  hands: {
    player1: [],
    player2: []
  },
  chest: {
    player1: [],
    player2: []
  },
  warPot: [],
  suits: ['spades', 'clubs', 'diamonds', 'hearts'],
  cardNames: ['Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King', 'Ace', 'Two'],
  cards: [],
  generateCardValues: function() {
    this.cards = [];
    for(let i = 0; i < this.suits.length; i++){
      for(let j = 0; j < 13; j++){
        this.cards.push([this.suits[i], j]);
      }}
    return this.cards;
  },
  shuffle: function(array) {
    return array.sort( () => Math.random() - 0.5);
  },
  returnShuffledCards: function(array) {
    return this.shuffle(array);
  },
  dealNewGame: function() {
    this.hands.player1 = [];
    this.hands.player2 = [];
    this.chest.player1 = [];
    this.chest.player2 = [];
    let cardsToShuffle = this.generateCardValues();
    let cardsArray = this.returnShuffledCards(cardsToShuffle);
    let counter = 0;
    for(let i=0; i < cardsArray.length; i++){
      if(counter % 2 === 0){
        this.hands.player1.push(cardsArray[i]);
        counter++;
      } else {
        this.hands.player2.push(cardsArray[i]);
        counter++;
      }}
    return this.hands.player1;
  },
  playCard: function(){
    if (this.hands.player1.length === 0 || this.hands.player2.length === 0){
      this.shuffleChest();
      return this.hands.player1;
    }
    //play card
    const player1Play = this.hands.player1[0];
    //remove card from hand
    this.hands.player1.splice(0,1);

    const player2Play = this.hands.player2[0];
    this.hands.player2.splice(0,1);
    //add card to current trick
    const pot = [...this.warPot, player1Play, player2Play];
    this.warPot = [];
    console.log('Pot: ', pot);
    //send cards to evaluate
    this.evaluatePlay(player1Play, player2Play, pot);
    return this.hands.player1;
  },
  evaluatePlay: function(play1, play2, pot){
    let player1War = [];
    let player2War = []; 
    if (play1[1] > play2[1]){
      this.chest.player1.push(...pot);
    } else if(play1[1] === play2[1]){
      console.log('WARRRRRRRR');
      if(this.hands.player1.length < 3 || this.hands.player2.length < 3){
        this.shuffleChest;
        return this.hands.player1;
      } 
      for(let i= 0; i < 3; i++){
        player1War.push(this.hands.player1[i]);
      }
      this.hands.player1.splice(0,3);

      for(let i= 0; i < 3; i++){
        player2War.push(this.hands.player2[i]);
      }
      this.hands.player2.splice(0,3);
      pot.push(...player1War);
      pot.push(...player2War);
      console.log(pot);
      this.warPot = pot;
      this.playCard();      
    } else {
      this.chest.player2.push(...pot);
    }
    console.log('player1chest: ',this.chest.player1);
    console.log('player2chest: ',this.chest.player2);
  },
  shuffleChest: function(){
    //shuffle chests
    const chest1 = this.chest.player1;
    const shuffledChest1 = this.returnShuffledCards(chest1);
    console.log('shuffled chest1: ', shuffledChest1);

    const chest2 = this.chest.player2;
    const shuffledChest2 = this.returnShuffledCards(chest2);
    console.log('shuffled chest2: ',shuffledChest2);
    //move to hands
    this.hands.player1.push(...shuffledChest1);
    this.chest.player1.splice(0, this.chest.player1.length);
    this.chest.player1 = [];
    console.log('Player 1 Hand: ', this.hands.player1);

    this.hands.player2.push(...shuffledChest2);
    console.log('Player 2 Hand: ', this.hands.player2);
    this.chest.player2.splice(0, this.chest.player2.length);
    this.chest.player2 = [];
  },
  cardsIntoDb: function(db, cards) {
    return db 
      .insert(cards)
      .into('game')
      .returning('*')
      .then(([cards]) => cards);
  },
  handOutOfDb: function(db){
    return db
      .from('hands');
  },
};

module.exports = cardMethods;