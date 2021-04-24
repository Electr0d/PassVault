document.body.style.overflow = 'hidden';
let startupText;
function startupTextAnimation() {
  let i = 1;
  startupText = setInterval(() => {
    document.querySelector('.loading-msg').textContent = 'Loading' + '.'.repeat(i);
    
    
    // increment i and restart if above 3
    i++;
    if(i > 3) i = 1;
  }, 250);
  
}
startupTextAnimation();

function loaded() {
  console.log('loaded');
  setTimeout(function() {
    // loading overlay draw-out animation
    console.log('%c NOTICE: content loaded.', greenColor);
    document.querySelector('.loading-overlay').classList.add('loading-overlay-draw-out');
    // update icon
    document.querySelector('#loading-backdrop').src = path.join(__dirname, '../assets/img/icon-backdrop-green.png');
    // update text
    clearInterval(startupText);
    document.querySelector('.loading-msg').textContent = 'Loaded';
    
    
    // container animation
    app.classList.remove('container-draw-in');
    setTimeout(function() {
      document.body.removeChild(document.querySelector('.loading-overlay'));
      document.body.style.overflow = '';
  }, 1000);
  }, 1000);
}

document.addEventListener('DOMContentLoaded', loaded, false);