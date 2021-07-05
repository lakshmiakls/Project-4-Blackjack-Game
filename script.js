let game = {
    'you': {'scorespan':'#yourscore', 'div':'.yourbox','score':0},
    'dealer': {'scorespan':'#dealerscore', 'div':'.dealerbox','score':0},
    'cards': ['2','3','4','5','6','7',
    '8','9','10','K','J','Q','A'],
    'cardspts': {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'J':10,'Q':10,'A':1},
    'wins': 0, 
    'losses': 0,
    'draws': 0,
    'isstand': false,
    'turnsover': false,
    'logicover': false
    }

    const YOU = game['you'];
    const DEALER = game['dealer'];

    const hitSound = new Audio('sounds/swish.mp3');
    const bustSound = new Audio('sounds/aww.mp3');
    const coinSound = new Audio('sounds/coin.mp3');
    const drawSound = new Audio('sounds/draw.mp3');

    document.querySelector('.hit').addEventListener('click',hit);
    document.querySelector('.stand').addEventListener('click',stand);
    document.querySelector('.deal').addEventListener('click',deal);

function randomcard() {
    let randomindex = Math.floor(Math.random()*13);
    return game['cards'][randomindex];
}

async function hit() {
    if (game['isstand'] === false) {
        let card = randomcard();
        console.log(card)
        showcard(card, YOU);
        updatescore(card, YOU);
        showscore(YOU);
        console.log(YOU['score'])
        if (YOU['score'] > 21) {
            await sleep(1000);
            game['logicover'] = false;
            game['isstand'] = true;
            stand();
        }
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}


function showcard(card, player) {
    
    if (player['score']+game['cardspts'][card] <= 21) {
        let cardimage = document.createElement('img');
        cardimage.src = `./img/${card}.png`;
        document.querySelector(player['div']).appendChild(cardimage);
        hitSound.play();
    }
}

function updatescore(card,player) {
    player['score'] += game['cardspts'][card];
}

function showscore(player) {
    if (player['score'] > 21) {
    document.querySelector(player['scorespan']).innerText = "bust";
    document.querySelector(player['scorespan']).style.color = "red";
    }else {
    document.querySelector(player['scorespan']).innerText = player['score'];
    }
}
// console.log(showscore(YOU));


async function stand() {
    if (game['logicover'] === false) {
        game['isstand'] = true;
        
        while (DEALER['score'] < 16) {
            let card = randomcard();
            showcard(card, DEALER);
            updatescore(card, DEALER);
            showscore(DEALER);
            await sleep(2000);
        }
        game['turnsover'] = true;
        let winner = assesswinner();
        showresult(winner);
        game['logicover'] = true;
    }
}

function assesswinner() {
    let winner;
    if (YOU['score']<=21){
        if (YOU['score'] > DEALER['score']  || (DEALER['score'] > 21)) {
            winner = YOU;
        }else if (YOU['score'] < DEALER['score']) {
            winner = DEALER
        } else if (YOU['score'] === DEALER['score']){
            
        }
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21){
        winner = DEALER;
    }else if (YOU['score'] > 21 && DEALER['score'] > 21) {
    
    }
    return winner;
    }

    function showresult(winner)    {
        let message,messagecolor
        if (winner === YOU){
            message = 'You Won!';
            messagecolor = 'green';
            coinSound.play();
            game['wins']++;
            document.getElementById('wins').innerText = game['wins']
        } else if (winner === DEALER) {
            message = 'You Lost!';
            messagecolor = 'red';
            bustSound.play();
            game['losses']++;
            document.getElementById('losses').innerText = game['losses']
        }else {
            message = 'You Tied!';
            messagecolor = 'yellow';
            drawSound.play();
            game['draws']++;
            document.getElementById('draws').innerText = game['draws']
        }
        showresultDiv = document.getElementById("heading");
        showresultDiv.innerText = message;
        showresultDiv.style.color = messagecolor;
    }

function deal() {
    if (game['turnsover']  === true) {
        game['isstand'] = false;
        dealcard(YOU);
        dealcard(DEALER);
        let showresultDiv= document.getElementById("heading");
        showresultDiv.innerText = "Let's Play";
        showresultDiv.style.color = "white";
        game['turnsover'] = false;
        game['logicover'] = false;
        
    }
}

function dealcard (player) {
    let Images = document.querySelector(player['div']).querySelectorAll('img');
    
    for (i=0; i < Images.length; i++) {
        Images[i].remove();
    }
    hitSound.play();
    player['score'] = 0;
    document.querySelector(player['scorespan']).innerText=player['score'];
    document.querySelector(player['scorespan']).style.color='white';
    };


    const triggerControl = (event) => {
        let keyCode = event.keyCode;
        if (keyCode == "72") {
        hit();
        } else if (keyCode == "68") {
        deal();
        } else if (keyCode == "83") {
        stand();
        }
    }

    addEventListener('keydown', triggerControl);