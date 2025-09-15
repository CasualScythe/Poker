const cardValues = ['A', ...Array.from({ length: 9 }, (_, i) => (i + 2).toString()), 'J', 'Q', 'K'];
const cardSuits = ['C', 'D', 'H', 'S'];
const cardInners = document.getElementsByClassName("card-inner");
const cardFronts = document.getElementsByClassName("card-front");
const showMyMoney = document.getElementById("my-money");
const showBetMoney = document.getElementById("my-bet-money");
const showRanking = document.getElementById("ranking");

let isBettingSame = false; //배팅이 같은지
let openCard = 0; //공개된 카드 수
let images = []; //카드 이미지 경로 배열
let nowCards = []; //현재 필드에 있는 카드
let myMoney = 8300; //내 돈
let betMoney = 0; //배팅 금액
let nowRanking = "하이카드"; //현재 족보

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

//처음 2장 카드 nowCards에 추가
nowCards.push(images[5].slice(7, -4));
nowCards.push(images[6].slice(7, -4));

// //언젠가 쓰지 않을까 해서 만든 랜드인트
// function randInt(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

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
    flipCard(4);
  } //두번째 카드 공개
  else if (openCard == 4) {
    flipCard(5);
  } //마지막 카드 공개
}

//카드 뒤집기 로직
function flipCard(num) {
  for (let i = openCard; i < num; i++) {
    cardInners[i].style.transform = "rotateY(0deg)";
    nowCards.push(images[i].slice(7, -4));//nowCards에 공개된 카드 추가
    openCard++;
  }
  rankingLogic();
}

//리스트 개수 세기 로직
function countList(li) {
  let elements = [];
  let counts = [];
  for (let i = 0; i < li.length; i++) {
    if(elements.includes(li[i])) {
      counts[elements.indexOf(li[i])] += 1;
    } 
    else {
      elements.push(li[i]);
      counts.push(1);
    }
  }
  return { elements, counts };
}

//족보 판단 로직
function rankingLogic() {
  let nowNumbers = [];
  let nowTypes = [];
  let nowRealNumbers = []; //스트레이트를 판단하기 위해서 문자(A, J, Q, K)를 숫자로 바꾼 리스트
  let isStraight = false;
  let isRoyalStraight = false;
  for (let i = 0; i < nowCards.length; i++) { //nowCards를 숫자와 모양으로 분리해서 각각 리스트에 저장
    nowNumbers.push(nowCards[i].slice(0, -1));
    nowTypes.push(nowCards[i].slice(-1));
  }
  for (let i = 0; i < nowNumbers.length; i++) { //스트레이트를 판단하기 위해서 nowRealNumbers에 숫자 저장
    if (nowNumbers[i] === 'A') {
      nowRealNumbers.push(1);
      nowRealNumbers.push(14);
    }
    else if (nowNumbers[i] === 'J') {
      nowRealNumbers.push(11);
    }
    else if (nowNumbers[i] === 'Q') {
      nowRealNumbers.push(12);
    }
    else if (nowNumbers[i] === 'K') {
      nowRealNumbers.push(13);
    }
    else {
      nowRealNumbers.push(parseInt(nowNumbers[i]));
    }
  }
  for (let i = 0; i < nowRealNumbers.length; i++) { //스트레이트 & 로얄 스트레이트 판단
    if (nowRealNumbers.includes(nowRealNumbers[i] + 1) && nowRealNumbers.includes(nowRealNumbers[i] + 2) && nowRealNumbers.includes(nowRealNumbers[i] + 3) && nowRealNumbers.includes(nowRealNumbers[i] + 4)) {
      if (nowRealNumbers[i] === 10) {
        isRoyalStraight = true;
      }
    isStraight = true;
    }
  }
  let isFlush = Math.max(...countList(nowTypes).counts) >= 5;
  let isFourCard = Math.max(...countList(nowNumbers).counts) === 4;
  let isTriple = Math.max(...countList(nowNumbers).counts) === 3;
  let isPair = Math.max(...countList(nowNumbers).counts) === 2;
  let isFullHouse = isTriple && isPair;
  let isTwoPair = countList(nowNumbers).counts.filter(x => x === 2).length >= 2;
  if (isRoyalStraight && isFlush) {
    nowRanking = "로얄 스트레이트 플러쉬";
  }
  if (isStraight && isFlush) {
    nowRanking = "스트레이트 플러쉬";
  }
  else if(isFourCard) {
    nowRanking = "포카드";
  }
  else if(isFullHouse) {
    nowRanking = "풀 하우스";
  }
  else if(isFlush) {
    nowRanking = "플러쉬";
  }
  else if(isStraight) {
    nowRanking = "스트레이트";
  }
  else if(isTriple) {
    nowRanking = "트리플";
  }
  else if(isTwoPair) {
    nowRanking = "투 페어";
  }
  else if(isPair) {
    nowRanking = "원 페어";
  }
  else {
    nowRanking = "하이 카드";
  }
  showRanking.textContent = `${nowRanking}`;
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

rankingLogic();
