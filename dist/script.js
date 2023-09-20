function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// placeholder content
var placeholder = document.getElementsByClassName('translated');
var content = "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla commodo quam nisi, id pretium diam congue ac.</p>";

for(var i = 0; i < placeholder.length; i++){
	placeholder[i].innerHTML +=  content;
  
  let str = placeholder[i].querySelector('p').textContent;
  

  const myArr = str.split(" ");

  let broken = '';

  myArr.forEach(words => broken+=('<span>'+words+'</span>'));

  function updateOrg(x){
    placeholder[i].innerHTML = '<p>'+x+'</p>';
  }
  
  updateOrg(broken);
}

// for(var i = 0; i < placeholder.length; i++){

//   let str = placeholder[i].getElementsByTagName('p').textContent;
//   const myArr = str.split(" ");

//   let broken = '';

//   myArr.forEach(words => broken+=('<span>'+words+'</span>'));

//   function updateOrg(x){
//     placeholder[i].innerHTML = x;
//   }
  
//   updateOrg(broken);
// }



// end placeholder content

var rndInt = randomIntFromInterval(1, 22)

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
  
  var numOpen = rndInt %2 == 0 ? (rndInt/2) : ((rndInt+1)/2);
  var open = pages.item(numOpen+1);
  let button = document.getElementById('pagenum');
  var selected = rndInt %2 == 0 ? open.getElementsByClassName('front')[0] : pages.item(numOpen).getElementsByClassName('back')[0];
  
  if (activePage != numOpen){
    if (chosen[0]){chosen[0].classList.remove('chosen');}

    button.textContent = rndInt;

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
    }
  
    multiflip();
    after();
  
  }
  
  rndInt = randomIntFromInterval(1, 22);
}

$('#scene')
.on('click', '.active', nextPage)
.on('click', '.flipped', prevPage)
.on('click', '.reset', firstPage);

// functions for mobile swiping
var hammertime = new Hammer($('.book')[0]);
hammertime.on("swipeleft", nextPage);
hammertime.on("swiperight", prevPage);

function prevPage(x) {
  $('.page div')
  .removeClass('chosen')
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
  .removeClass('chosen')
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