const cardMethods = require('./services-cardMethods');

const cardLogic = {
  playerCounter: 2,
  nextMove: function(obj){
    //find next players hand
    // let {player2, player3, player4} = cardMethods.hands;
    // console.log(player2);
    // console.log(player3);
    // console.log(player4);
    console.log(cardMethods);
    let currentHand = cardMethods.hands[`player${this.playerCounter}`];
    let playedCard = currentHand.splice(0,1);
    console.log(cardMethods.hands);
    let returnObj = {playedCard, playerCounter: this.playerCounter};

    this.playerCounter ++;
    if (this.playerCounter > 4){
      this.playerCounter = 2;
    }

    //use the object with two parameters that were sent, to determine what should be played next
    return returnObj;
    //splice next user's hand.
  }
};

module.exports = cardLogic;