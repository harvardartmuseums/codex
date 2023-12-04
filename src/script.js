var translations = [
  '<p>The Gospel of the lots of Mary, the mother of the Lord Jesus Christ, she to whom Gabriel the archangel brought the good news. He who will go forward with his whole heart will obtain what he seeks. Only do not be of two minds.</p>',
  '<p>O human, with their tongues they love you greatly, but their heart is far from you.</p>',
  '<p>And you know what happened to you before today, that you almost lost your life. In any case they certainly lie in wait for you.</p>',
  '<p>Be happy, rejoice, be glad and glorify God for what has happened to you. Because it was only a little while ago that you were far from home,</p>',
  '<p>then you suffered loss and were in disgrace and danger. But God took pity on you.</p>',
  '<p>Behold, you have been saved, do not turn to commit sin, so that even worse matters do not happen to you.</p>',
  '<p>Do you not remember what has happened to you before today? And God saved you from everything. Do not return to this matter.</p>',
  '<p>It is you alone who brings upon yourself a great, difficult burden. This matter that you want to do, its time has not yet come. </p>',
  '<p>Endure a little longer and you will see the confidence in God that will reach you.</p>',
  '<p>They will trust you in this matter. Be brave and endure, for the time is hastening for you. </p>',
  '<p>Do not be distressed nor despair nor grieve, because you have a strong hope through God.</p>',
  '<p>The Lord God has heard your request and he will send his angel and he will walk before you.</p>',
  '<p>And you will see the confidence in God that will reach you. Only do not become careless, saying “this thing will not happen.” Yes, it will happen.</p>',
  '<p>You know, O human, that you did your utmost again. You did not gain anything but loss, dispute, and war.</p>',
  '<p>But if you are a little patient, the matter will prosper through the God of Abraham, Isaac, and Jacob.</p>',
  '<p>Fight for yourself in what has happened to you, because it is a human evil. Your enemies are not far from you. </p>',
  '<p>They have plotted against you again due to the evil that is in their hearts. But trust in God and walk in his commandments forever.</p>',
  '<p>Get up and go immediately. Do not delay. For this is the moment that God appointed for you. </p>',
  '<p>They have simply accused you to the point of death, but be patient just a little.</p>',
  '<p>The peace of God will be with you and you will be saved from the affliction that has come upon you.</p>',
  '<p>Fulfill what you promised, because God does not tempt anyone. It is you alone who are disobedient.</p>',
  '<p>If you decide to do this thing, do it. Do not be careless, because God established this. It is you alone who turns back.</p>',
 '<p>No – there is no evil that will reach you. Trust in God and do not be of two minds.</p>',
 '<p>Do not let go of the faith in your heart. You have God as a helper. He will guide you on the path on which you will go.</p>',
 '<p>At all events, do not doubt because nothing is impossible for God.</p>'
];
var interval = [1,10];
var rndInt = 0;

var toggle = document.getElementsByClassName("front");

for (var i = 0; i < toggle.length; i++) {
   children = toggle[i].querySelector('.translated');

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