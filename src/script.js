import translations from './translations.js';

var interval = [2,37];
var rndInt = 0;

var toggle = document.getElementsByClassName("front");
var toggleback = document.getElementsByClassName("back");
var newRndm = document.getElementById('newRndm');
var intro = document.getElementById('intro');
var outro = document.getElementById('outro');
var newQ = document.getElementById('newQ');
var book = document.getElementById('scene');
var translatebtn = document.getElementById('translate');

// ON PAGE TRANSLATE BUTTON
// for (var i = 0; i < toggle.length; i++) {
//    var children = toggle[i].querySelector('.translated');

//   const translateImage = new Image();
//   translateImage.src = "images/translate_button.png";
//   translateImage.classList.add("translate");
   
//    if (children != null){
//     children.before(translateImage);
//    }
// }

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

function setLang(){
  if (!translatebtn.classList.contains('english')){
    translatebtn.classList.toggle("english");
  }
}

// add tab index to pages
function tabs(page){
  for(var i = 0; i < page.length; i++){
    page[i].setAttribute("tabindex", "0");
    page[i].setAttribute("disabled", "disabled");
  }
}
tabs(toggle);
tabs(toggleback);


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
    activity();
    coverCheck();
    }, time);
}

function start(time){
  intro.classList.add('started');
  randomBtn.classList.add('hide');
  setTimeout(() => {
    outro.classList.add('started');
    newQ.classList.add('started');
    book.classList.remove('small');
  }, time);
}


// reset book to closed
function reset(){
  
  setLang();

  intro.classList.remove('started');
  outro.classList.remove('started');
  newQ.classList.remove('started');
  book.classList.add('small');
  randomBtn.classList.remove('hide');
  $('.page div').removeClass('chosen T');

  var current = document.getElementsByClassName('active')[0];
  var activePage = Array.from(document.getElementsByClassName('page'))
    .indexOf(current);

  setTimeout(() => {
    firstPage();
    }, Number(Math.ceil(((1 + activePage) / 8)) *1000));
}

randomBtn.addEventListener("click", function(){random(rndInt, setPrev, 1000), start(600);});

translatebtn.addEventListener("click", function(){reveal(), translatebtn.classList.toggle("english");});

newRndm.addEventListener("click", function(){random(rndInt, setPrev, 200), activity();});

// commented out until manual reset button is placed
resetBtn.addEventListener("click", function(){reset(),random('0', setPrev);});

function coverCheck(){
  // if back cover visible, add class to newRndm
  let lastpage = document.querySelector('.last');
  setTimeout(() => {
      if(lastpage.classList.contains('flipped')) {
        book.classList.add('backcover');
        book.classList.remove('open');
      }else{
          book.classList.remove('backcover');
          book.classList.add('open');
      }
    }, 2000);
  
}

function random(num, after, delay) {

  setLang();

  setTimeout(function () {

  var current = document.getElementsByClassName('active')[0];
  var activePage = Array.from(document.getElementsByClassName('page'))
    .indexOf(current);

  var numOpen = num;
  
  var open = pages.item(numOpen);
  let button = document.getElementById('pagenum');
  var selected = open.getElementsByClassName('back')[0];
  var selectedSecond = pages.item(numOpen+1).getElementsByClassName('front')[0];
  
  if (activePage != numOpen){
    // if (chosen[0]){chosen[0].classList.remove('chosen');}

    //   move pages on a delay to flip through book
    let timer = ms => new Promise(res => setTimeout(res, ms))

    async function multiflip () {
      let direction = (activePage < numOpen) ? 'forward' : 'backward'; 
      let flips = (direction == 'forward') ? (numOpen-activePage+1): -(numOpen-activePage+1);

      let speed = 150;

      for (let index = 0; index < flips; ++index) {
        speed = speed > 10 ? speed - 3.5 : 10;

        if (direction == 'forward'){
          nextPage('multi');
        } else{
          prevPage('multi');
        }
         await timer(speed);
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

  if (num != 0){
    language(5000);
  }

  }, delay);

}

function language(time){
  setTimeout(() => {
    var pages = $(".page div");

    for (var i = 0; i < pages.length; i++) {
      pages[i].classList.add('chosen','T');
    }
  }, time);
}

function reveal(){

  var pageone = document.querySelector(".left .back");
  // var pagetwo = event.target.parentNode;
  var pagetwo = document.querySelector(".active .front");

  var isEnglish = document.getElementsByClassName('T');
  if (isEnglish.length > 0) {
    $('.page div').removeClass('chosen T');
  // }
  // if (pageone.classList.contains('T')){
  //   pageone.classList.remove('chosen','T');
  //   pagetwo.classList.remove('chosen','T');

  //   pageone.setAttribute("disabled", "disabled");
  //   pagetwo.setAttribute("disabled", "disabled");
  }else{
    pageone.classList.add('chosen','T');
    pagetwo.classList.add('chosen','T');

    pageone.setAttribute("disabled", "");
    language();
  }

  activity();
}

// reset book after inactivity (in seconds)
var windowClick = timer();
var inactivity = 60;
function timer() {
  if (intro.classList.contains('started')){
    return setInterval(() => (reset(), random('0', setPrev)), inactivity*1000);
  }
}

// reset inactivity timer with user interactions
function activity() {
  clearInterval(windowClick);
  windowClick = timer();
}
book.addEventListener("click", function(){activity();});


// legacy jQuery from book page turning functions

// on page translate button
// $(".translate").click(function(event){
//   event.stopPropagation();
//   reveal();
// });

$('#scene')
.on('click', '.active', function( event ) {
  nextPage(event.target.id);
})
.on('click', '.flipped', prevPage)
.on('click', '.reset', firstPage);

// functions for mobile swiping
var hammertime = new Hammer($('.book')[0]);
hammertime.on("swipeleft", nextPage);
hammertime.on("swiperight", prevPage);

function prevPage(x) {
  $('.flipped')
    .last()
    .removeClass('flipped')
    .removeClass('left')
    .addClass('active')
    .siblings('.page')
    .removeClass('active');
   if (x != 'multi'){
     setPrev(1000);
  }
}

function nextPage(x) {
  if (x == 'last'){
    // early return for clicking on empty space after back cover
    return;
  }
  // $('.page div')
  // .removeClass('chosen T')
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
     setPrev(1000);
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