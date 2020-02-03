var imgConn = document.getElementById('imgConnection');
var imgPath = '';
var myStatus = false;

const setStatus = status => {
	myStatus = status;
	imgPath = status ? './../images/conn.png?' : './../images/no-conn.png?';
	imgPath = imgPath + Date.now();
	imgConn.setAttribute('src', imgPath);
}

setStatus(navigator.onLine)

window.addEventListener('online', e => {
  setStatus(true)
})
window.addEventListener('offline', e => {
  setStatus(false)
})