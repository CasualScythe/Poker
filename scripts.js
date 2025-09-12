const cardValues = ['A', ...Array.from({ length: 9 }, (_, i) => (i + 2).toString()), 'J', 'Q', 'K'];
const cardSuits = ['C', 'D', 'H', 'S'];
const cardInners = document.getElementsByClassName("card-inner");
const cardFronts = document.getElementsByClassName("card-front");
const showMyMoney = document.getElementById("my-money");
const showBetMoney = document.getElementById("my-bet-money");

let isBettingSame = false; //배팅이 같은지
let openCard = 0; //공개된 카드 수
let images = []; //카드 이미지 경로 배열
let nowCards = []; //현재 필드에 있는 카드
let myMoney = 8300; //내 돈
let betMoney = 0; //배팅 금액

//카드 이미지 경로 배열 생성
for (let value of cardValues) {
  for (let suit of cardSuits) {
    images.push(`./card/${value}${suit}.png`);
  }
}

//카드 섞기 함수
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // swap
  }
}

shuffle(images); //카드 섞기

//카드 이미지 할당
for (let i = 0; i < cardFronts.length; i++) {
  cardFronts[i].style.backgroundImage = `url(${images[i]})`;
}

//처음 7장 카드 nowCards에 추가
nowCards.push(images[5].slice(7, -4));
nowCards.push(images[6].slice(7, -4));

//언젠가 쓰지 않을까 해서 만든 랜드인트
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// //배팅 로직
// function bettingLogic() {
//   if (!isBettingSame) {
//     if (isFold) {

//     }
//     else if (isCheck) {
//       nextTurn();
//     }
//   }
//   else {
//     nextCard();
//   }
// }

//다음 카드 공개 로직
function nextCard() {
  if (openCard == 0) {
    flipCard(3);
  } //처음 카드 공개
  else if (openCard == 3) {
    flipCard(1);
  } //두번째 카드 공개
  else if (openCard == 4) {
    flipCard(1);
  } //마지막 카드 공개
}

//카드 뒤집기 로직
function flipCard(num) {
  for (let i = openCard; i < num; i++) {
    cardInners[i].style.transform = "rotateY(0deg)";
    nowCards.push(images[i].slice(7, -4));
    openCard++;
  }

}

//족보 판단 로직
function rankingLogic() {

}

//다음 게임 로직
function nextGame() {
  openCard = 0;
}

document.addEventListener("contextmenu", function (e) {
  e.preventDefault(); // 기본 우클릭 메뉴 막기
});

//베팅 로직
function bet(cost) {
  if (myMoney < cost) {
    alert("돈이 부족합니다.");
  }
  else {
    myMoney -= cost;
    betMoney += cost;
    showMyMoney.textContent = `내 돈\n${myMoney}`;
    showBetMoney.textContent = `나의 베팅\n${betMoney}`;
  }
}

//판매 로직
function withdraw(cost) {
  if (betMoney < cost) {
      alert("베팅 금액이 부족합니다.");
  }
  else {
    myMoney += cost;
    betMoney -= cost;
    showMyMoney.textContent = `내 돈\n${myMoney}`;
    showBetMoney.textContent = `나의 베팅\n${betMoney}`;
  }
}
