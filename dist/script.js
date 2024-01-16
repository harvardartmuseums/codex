import translations from './translations.js';

var interval = [2,37];
var rndInt = 0;

var toggle = document.getElementsByClassName("front");
var intro = document.getElementById('intro');
var book = document.getElementById('scene');

for (var i = 0; i < toggle.length; i++) {
   var children = toggle[i].querySelector('.translated');

  const translateImage = new Image();
  translateImage.src = "images/translation.png";
  translateImage.classList.add("translate");
   
   if (children != null){
    children.before(translateImage);
   }
}

// pick random number
async function choose(){
  var min = interval[0];
  var max = interval[1];
  
  var current = rndInt;
  var newInt = Math.floor(Math.random() * (max - min + 1) + min);
  if (current != newInt) {    
          rndInt = newInt;
  } 
  
  //   avoid getting the same number twice in a row
  while (current == newInt) {
      newInt = Math.floor(Math.random() * (max - min + 1) + min);
      if (current != newInt) {    
          rndInt = newInt;
          return;
      } 
  }

};

choose();


var pageText = document.getElementsByClassName('translated');

// place each word in span for page load animation
for(var i = 0; i < pageText.length; i++){
	pageText[i].innerHTML +=  translations[i];
  
  let str = pageText[i].querySelector('p').textContent;
  
  const myArr = str.split(" ");

  let broken = '';

  myArr.forEach(words => broken+=('<span>'+words+'</span>'));

  function updateWord(x){
    pageText[i].innerHTML = '<p>'+x+'</p>';
  }
  
  updateWord(broken);
}

var currentPage = 0;
var randomBtn = document.getElementById('random');
var resetBtn = document.getElementById('reset');
var pages = document.getElementById('book').children;
var active = document.getElementsByClassName('active');
var chosen = document.getElementsByClassName('chosen');

//  make previous page clickable and avoid jitter on mobile while flip finishes
function setPrev(time){
  setTimeout(() => {
    $('.active').prev().addClass('left');
    // 'inactive' currently here for first page click. Need to refine.
    inactive();
    }, time);
}

function start(){
  intro.classList.add('started');
  book.classList.remove('small');
  randomBtn.classList.add('hide');
}


// reset book to closed
function reset(){
  intro.classList.remove('started');
  book.classList.add('small');
  randomBtn.classList.remove('hide');

  var current = document.getElementsByClassName('active')[0];
  var activePage = Array.from(document.getElementsByClassName('page'))
    .indexOf(current);

  setTimeout(() => {
    firstPage();
    }, Number(Math.ceil(((1 + activePage) / 8)) *1000));
}

randomBtn.addEventListener("click", function(){random(rndInt, setPrev), start();});

// commented out until manual reset button is placed
// resetBtn.addEventListener("click", function(){random('0', setPrev); reset();});

function random(num, after) {
  var current = document.getElementsByClassName('active')[0];
  var activePage = Array.from(document.getElementsByClassName('page'))
    .indexOf(current);

  var numOpen = num;
  
  var open = pages.item(numOpen);
  let button = document.getElementById('pagenum');
  var selected = open.getElementsByClassName('back')[0];
  var selectedSecond = pages.item(numOpen+1).getElementsByClassName('front')[0];
  
  if (activePage != numOpen){
    if (chosen[0]){chosen[0].classList.remove('chosen');}

    //   move pages on a delay to flip through book
    let timer = ms => new Promise(res => setTimeout(res, ms))

    async function multiflip () {
      let direction = (activePage < numOpen) ? 'forward' : 'backward'; 
      let flips = (direction == 'forward') ? (numOpen-activePage+1): -(numOpen-activePage+1);

      for (let index = 0; index < flips; ++index) {
        if (direction == 'forward'){
          nextPage('multi');
        } else{
          prevPage('multi');
        }
         await timer(150);
      }

      if (num != 0) {
        selected.classList.add('chosen','T');
        selectedSecond.classList.add('chosen','T');
      }else{

      }
    }
  
    multiflip();
    after(8000);
  }
  
  choose();

}

function reveal(){
  var pageone = event.target.parentNode;
  var pagetwo = document.querySelector(".left .back");

  if (pageone.classList.contains('T')){
    pageone.classList.remove('chosen','T');
    pagetwo.classList.remove('chosen','T');
  }else{
    pageone.classList.add('chosen','T');
    pagetwo.classList.add('chosen','T');
  }
}

$('#scene')
.on('click', '.active', nextPage)
.on('click', '.flipped', prevPage)
.on('click', '.reset', firstPage);

$(".translate").click(function(event){
  event.stopPropagation();
  reveal();
});

// reset book after inactivity (in seconds)
var windowClick = timer();
var inactivity = 60;
function timer() {
  if (intro.classList.contains('started')){
    return setInterval(() => (reset(), random('0', setPrev)), inactivity*1000);
  }
}
function inactive() {
  clearInterval(windowClick);
  windowClick = timer();
}
book.addEventListener("click", function(){inactive();});

// functions for mobile swiping
var hammertime = new Hammer($('.book')[0]);
hammertime.on("swipeleft", nextPage);
hammertime.on("swiperight", prevPage);

// legacy jQuery from book page turning functions
function prevPage(x) {
  $('.page div')
  .removeClass('chosen T')
  $('.flipped')
    .last()
    .removeClass('flipped')
    .removeClass('left')
    .addClass('active')
    .siblings('.page')
    .removeClass('active');
   if (x != 'multi'){
     setPrev(2000);
  }
}
function nextPage(x) {
  $('.page div')
  .removeClass('chosen T')
  $('.flipped')
    .last()
    .removeClass('left')
  $('.active')
    .removeClass('active')
    .addClass('flipped')
    .next('.page')
    .addClass('active')
    .siblings('');  
  if (x != 'multi'){
     setPrev(2000);
  }
}


function firstPage() {
  $('.page')
    .first()
    .addClass('active')
    .removeClass('flipped')
    .siblings('.page')
    .removeClass('active')
    .removeClass('flipped');
}