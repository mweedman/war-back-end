let cardMethods = {
  hands: {
    player1: [],
    player2: []
  },
  chest: {
    player1: [],
    player2: []
  },
  play1:[],
  play2:[],
  pot:[],
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

    this.dbCreateStats(db, user);
    this.dbDeleteUserGames(db, user)
      .then(([game])=> {
        game;
        this.dbCreateGame(db, user)
          .then(game => {
            this.dbCreateHands(db, game.id);
          });
      });
    
    const resObj = {
      handLength1: this.hands.player1.length,
      handLength2: this.hands.player2.length,
      chestLength1: this.chest.player1.length,
      chestLength2: this.chest.player2.length
    };
    return resObj;
  },
  playCard: async function(db, user_id, warPot){
    const game_id = await this.getGameId(db, user_id);
    await this.updateHands(db, game_id);
    if (this.hands.player1.length === 0 && this.chest.player1.length === 0) {
      return this.player2Wins(db, user_id);
    } else if (this.hands.player2.length === 0 && this.chest.player2.length === 0) {
      return this.player1Wins(db, user_id);
    } else if (this.hands.player1.length === 0 || this.hands.player2.length === 0){
      this.shuffleChest();
      return this.hands.player1;
    }
    //play card
    const player1Play = this.hands.player1[0];
    this.play1 = player1Play;
    //remove card from hand
    this.hands.player1.splice(0,1);

    const player2Play = this.hands.player2[0];
    this.play2 = player2Play;
    this.hands.player2.splice(0,1);
    //add card to current trick
    this.pot = [...this.warPot, player1Play, player2Play];
    
    //send cards to evaluate
    this.evaluatePlay(player1Play, player2Play, this.pot, user_id, db);
    const resObj = {
      pot: this.pot,
      chest1: this.chest.player1,
      warpot: this.warPot,
      handLength1: this.hands.player1.length,
      handLength2: this.hands.player2.length,
      chestLength1: this.chest.player1.length,
      chestLength2: this.chest.player2.length
    };
    
    // const trickObj = {
    //   play1: player1Play,
    //   play2: player2Play,
    //   pot: this.pot,
    //   war_pot: this.warPot, 
    // };

    return resObj;
  },
  evaluatePlay: function(play1, play2, pot, user_id, db){
    let player1War = [];
    let player2War = []; 
    if (play1[1] > play2[1]){
      this.chest.player1.push(...pot);
      this.getGameId(db, user_id)
        .then(gameid => {
          this.dbCreateTrick(db, gameid);
        });
      this.warPot = [];
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
      this.warPot = pot;
      this.playCard(db,user_id);      
    } else {
      this.chest.player2.push(...pot);
      this.getGameId(db, user_id)
        .then(gameid => {
          this.dbCreateTrick(db, gameid);
        });
      this.warPot = [];
    }
  },
  player1Wins: function(db, user_id) {
    let resObj = { message: 'player 1 wins' };
    this.updateWins(db, user_id);
    return resObj;
  },
  player2Wins: function(db, user_id) {
    let resObj = { message: 'player 2 wins' };
    this.updateGames(db, user_id);
    return resObj;
  },
  shuffleChest: function() {
    //shuffle chests
    const chest1 = this.chest.player1;
    const shuffledChest1 = this.returnShuffledCards(chest1);
    const chest2 = this.chest.player2;
    const shuffledChest2 = this.returnShuffledCards(chest2);
    //move to hands
    this.hands.player1.push(...shuffledChest1);
    this.chest.player1.splice(0, this.chest.player1.length);
    this.chest.player1 = [];

    this.hands.player2.push(...shuffledChest2);
    this.chest.player2.splice(0, this.chest.player2.length);
    this.chest.player2 = [];
  },
  getGameId(db, userid) {
    return db
      .from('game')
      .where('userid', userid)
      .then(([game]) => game)
      .then(game => game.id);
  },
  dbDeleteUserGames(db, userid) {
    return db('game')
      .where('userid', userid)
      .del()
      .returning('*');
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
  dbCreateTrick(db, game_id) {
    const play1 = this.play1;
    const play2 = this.play2;
    const pot = this.pot;
    const war_pot = this.warPot;
    return db('tricks')
      .insert({game_id, play1, play2, pot, war_pot})
      .returning('*')
      .then(([trick]) => trick)
      .catch(error => error);
  },
  dbCreateStats(db, user_id) {
    return db('stats')
      .insert({user_id})
      .returning('*')
      .then(([stats]) => stats)
      .catch(error => error);
  },
  updateHands(db, game_id) {
    let id;
    return db
      .select('*')
      .from('hands')
      .where({ game_id })
      .then(([hands]) =>{ 
        id = hands.id;
        hands.player1hand.slice(1,hands.player1hand.length);})
      .then(newArray => this.patchHands(db, id, newArray));
  },
  patchHands(db, game_id, array){
    return db('hands')
      .where({ game_id })
      .update({player1hand: array});
  },
  updateWins(db, user_id) {
    return db('stats')
      .increment('wins', 1)
      .increment('games_played', 1)
      .where('userid', user_id);
  },
  updateGames(db, user_id) {
    return db('stats')
      .increment('games_played', 1)
      .where('userid', user_id);
  }
};

module.exports = cardMethods;