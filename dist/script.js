import translations from './translations.js';

var interval = [1,20];
var rndInt = 0;

var toggle = document.getElementsByClassName("front");

for (var i = 0; i < toggle.length; i++) {
   var children = toggle[i].querySelector('.translated');

  const translateImage = new Image();
  translateImage.src = "images/translation.png";
  translateImage.classList.add("translate");
   
   if (children != null){
    children.before(translateImage);
   }
}

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



// placeholder content
var placeholder = document.getElementsByClassName('translated');

for(var i = 0; i < placeholder.length; i++){
	placeholder[i].innerHTML +=  translations[i];
  
  let str = placeholder[i].querySelector('p').textContent;
  
  const myArr = str.split(" ");

  let broken = '';

  myArr.forEach(words => broken+=('<span>'+words+'</span>'));

  function updateOrg(x){
    placeholder[i].innerHTML = '<p>'+x+'</p>';
  }
  
  updateOrg(broken);
}

var currentPage = 0;
var randomBtn = document.getElementById('random');
var pages = document.getElementById('book').children;
var active = document.getElementsByClassName('active');
var chosen = document.getElementsByClassName('chosen');

//  make previous page clickable and avoid jitter on mobile while flip finishes
function setPrev(){
  setTimeout(() => {
    $('.active').prev().addClass('left');
    }, 2000);
}

randomBtn.addEventListener("click", function(){random(setPrev)});

function random(after) {

  //   current open page (index of section with active) 
  var current = document.getElementsByClassName('active')[0];
  var activePage = Array.from(document.getElementsByClassName('page'))
    .indexOf(current);
  
  //   for single pages
  // var numOpen = rndInt %2 == 0 ? (rndInt/2) : ((rndInt+1)/2);
  
  //   for 2 page spread
  var numOpen = rndInt;
  
  var open = pages.item(numOpen);
  let button = document.getElementById('pagenum');
  var selected = open.getElementsByClassName('back')[0];
  var selectedSecond = pages.item(numOpen+1).getElementsByClassName('front')[0];
  
  
  if (activePage != numOpen){
    if (chosen[0]){chosen[0].classList.remove('chosen');}

    // button.textContent = rndInt;

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
         await timer(200);
      }
      selected.classList.add('chosen');
      selectedSecond.classList.add('chosen');
    }
  
    multiflip();
    after();
  }
  
  choose();

}

function reveal(){
  var pageone = event.target.parentNode;
  var pagetwo = document.querySelector(".left .back");

  pageone.classList.add('chosen','T');
  pagetwo.classList.add('chosen','T');
}

$('#scene')
.on('click', '.active', nextPage)
.on('click', '.flipped', prevPage)
.on('click', '.reset', firstPage);

$(".translate").click(function(event){
  event.stopPropagation();
  reveal();
});

// functions for mobile swiping
var hammertime = new Hammer($('.book')[0]);
hammertime.on("swipeleft", nextPage);
hammertime.on("swiperight", prevPage);

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
     setPrev();
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
     setPrev();
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