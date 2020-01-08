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
  suits: [1, 2, 3, 4],
  suitsNames: ['spades', 'clubs', 'diamonds', 'hearts'],
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
  dealNewGame: function(db, user) {
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
    

    this.dbCreateGame(db, user)
      .then(game => {
        this.dbCreateHands(db, game.id);
      });
    
    const resObj = {
      handLength1: this.hands.player1.length,
      handLength2: this.hands.player2.length,
      chestLength1: this.chest.player1.length,
      chestLength2: this.chest.player2.length,
      game_id: this.game_id
    };
    return resObj;
  },
  playCard: function(db, user_id){
    console.log(db);
    console.log(user_id);
    if (this.hands.player1.length === 0 && this.chest.player1.length === 0) {
      return this.player2Wins();
    } else if (this.hands.player2.length === 0 && this.chest.player2.length === 0) {
      return this.player1Wins();
    } else if (this.hands.player1.length === 0 || this.hands.player2.length === 0){
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
    const resObj = {
      pot: pot,
      chest1: this.chest.player1,
      warpot: this.warPot,
      handLength1: this.hands.player1.length,
      handLength2: this.hands.player2.length,
      chestLength1: this.chest.player1.length,
      chestLength2: this.chest.player2.length
    };
    const trickObj = {
      play1: player1Play,
      play2: player2Play,
      pot: pot,
      war_pot: this.warPot, 
    };
    const game_id = this.getGameId(db, user_id);
    this.dbCreateTrick(db, game_id, trickObj);
    return resObj;
  },
  evaluatePlay: function(play1, play2, pot){
    let player1War = [];
    let player2War = []; 
    if (play1[1] > play2[1]){
      this.chest.player1.push(...pot);
    } else if(play1[1] === play2[1]){
      console.log('WARRRRRRRR');
      if(this.hands.player1.length < 3 || this.hands.player2.length < 3){
        this.shuffleChest();
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
    console.log('player1chest: ',this.chest.player1.length);
    console.log('player2chest: ',this.chest.player2.length);
  },
  player1Wins: function() {
    let resObj = { message: 'player 1 wins' };
    return resObj;
  },
  player2Wins: function() {
    let resObj = { message: 'player 2 wins' };
    return resObj;
  },
  shuffleChest: function() {
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
    console.log('Player 1 Hand: ', this.hands.player1.length);

    this.hands.player2.push(...shuffledChest2);
    console.log('Player 2 Hand: ', this.hands.player2.length);
    this.chest.player2.splice(0, this.chest.player2.length);
    this.chest.player2 = [];
  },
  setGameId(id){
    console.log(id);
    this.game_id = id;
    console.log(this.game_id);
  },
  cardsIntoTrick: function(db, trick) {
    return db 
      .insert(trick)
      .into('tricks')
      .returning('*')
      .then(([cards]) => cards);
  },
  getAllGames(db) {
    return(db)
      .from('game')
      .select('*')
      .groupBy('userid');
  },
  getGameId(db, userid) {
    return this.getAllGames(db)
      .where('userid', userid)
      .then(([game]) => game)
      .then(game => game.id);
  },
  dbCreateGame(db, userid) {
    return db('game')
      .insert({userid})
      .returning('*')
      .then(([game]) => game);
  },
  dbCreateHands(db, game_id) {
    const player1hand = this.hands.player1;
    const player2hand = this.hands.player2;
    const player1chest = this.chest.player1;
    const player2chest = this.chest.player2;

    return db('hands')
      .insert({game_id, player1hand, player2hand, player1chest, player2chest})
      .returning('*')
      .then(([hands]) => hands)
      .catch(error => error);
  },
  dbCreateTrick(db, game_id, trick) {
    let { play1, play2, pot, war_pot } = trick;
    if(war_pot === []) war_pot = null;
    return db('tricks')
      .insert({game_id, play1, play2, pot, war_pot})
      .returning('*')
      .then(([trick]) => trick)
      .catch(error => error);
  },
  updateHandsAndTricks(resObj) {

    return db('hands');
      
  }
};

module.exports = cardMethods;