
import playList from './playList.js';
import { LANGUAGES, TRANSLATIONS } from './translate.js';

const checkLANG = document.getElementById('LANG');
let currentLanguage = localStorage.getItem('languageUser') || LANGUAGES.EN;

function setLang(event) {
    if(event.target && event.target.tagName === 'INPUT'){
        inputValue = event.target.value;
       currentLanguage = event.target.value;
       setPlaceholder();
       addTextSettings();
       getWeather(localStorage.getItem('cityUser'));
       getQuotes();
    }
}
checkLANG.addEventListener('click', setLang);

// placeholder 

const userName = document.getElementById('name'); 
const userCity = document.getElementById('city');

function setPlaceholder() {
    userName.setAttribute( 'placeholder', TRANSLATIONS[currentLanguage].NAME);
    userCity.setAttribute('placeholder', TRANSLATIONS[currentLanguage].CITYDEFAULT);
}
setPlaceholder();

// info
const time = document.querySelector('.time');
const date = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const dateOptions = {weekday: 'long', month: 'long', day: 'numeric',}


let timeOfDay;
function getTimeOfDay(x) {
    if (x < 6) {
        timeOfDay = TRANSLATIONS[currentLanguage].NIGHT;
    } else if (x > 5 && x < 12) {
        timeOfDay = TRANSLATIONS[currentLanguage].MORNING;
    } else if (x > 11 &&  x < 18) {
        timeOfDay = TRANSLATIONS[currentLanguage].AFTERNOON;
    } else {
        timeOfDay = TRANSLATIONS[currentLanguage].EVENING;
    }
    return  timeOfDay;
}

function showTime() {
    time.textContent = new Date().toLocaleTimeString();
    date.textContent = new Date().toLocaleDateString(TRANSLATIONS[currentLanguage].DATE, dateOptions);
    greeting.textContent = getTimeOfDay(new Date().getHours());
    setTimeout(showTime, 1000);
}
showTime();
//Local storage

function setLocalStorage () {
    localStorage.setItem('nameUser', userName.value);
    localStorage.setItem('cityUser', userCity.value);
    localStorage.setItem('languageUser', currentLanguage);
}

window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage () {
    if (localStorage.getItem('nameUser')) {
        userName.value = localStorage.getItem('nameUser'); 
    }
    if (localStorage.getItem('cityUser')) {
        userCity.value = localStorage.getItem('cityUser'); 
        return userCity.value
    }
    if (localStorage.getItem('languageUser')) {
        currentLanguage = localStorage.getItem('languageUser'); 
        return currentLanguage;
    }
    checkInput();
}

window.addEventListener('load', getLocalStorage);

//Background
const body = document.querySelector('body');
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev')

let randomNum = getRandomNum(1,20);

function getRandomNum (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


let timeOfBG;
function getTimeOfBG(x) {
    if (x < 6) {
        timeOfBG = 'night';
    }
    else if (x > 5 && x < 12) {
        timeOfBG = 'morning';
    }
    else if (x > 11 &&  x < 18) {
        timeOfBG = 'afternoon';
    }
    else {
        timeOfBG = 'evening';
    }
    return  timeOfBG;
}

async function checkSourse(num) {
    const sourse = localStorage.getItem('url') || 'git';
    timeOfBG = getTimeOfBG(new Date().getHours());
    let src;
    if (sourse === 'git') {
        if (num < 10) {
            num = '0' + num;
        }
        src = `https://raw.githubusercontent.com/Niadi26/stage1-tasks/assets/images/${timeOfBG}/${num}.jpg`;
    } else if (sourse === 'unsplash') {
        src = await getLinkToImageUn(num, timeOfBG);
    } else if (sourse === 'flickr') {
        src = await getLinkToImageFl(num, timeOfBG);
    }
    getBg(src)
}
checkSourse(randomNum)

function getBg(src) {
    const img = new Image();
    img.src = src;
    img.onload = () => {  
    body.style.backgroundImage = `url('${img.src}')`;
    }
};

async function getLinkToImageUn(num, time) {
    const url = `https://api.unsplash.com/photos/?${time}&orientation=landscape&page=1&per_page=150&client_id=-GLf81mBHCrcdc8QNVsRnwog9ZXNjk2fobfOvm1RFWo`;
    const res = await fetch(url);
    const data = await res.json();
    const src = data[num].urls.full;
    return src;
   }

async function getLinkToImageFl(num, time) {
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=88f45e1f8e8e9d3720da83ccb198d622&tags=${time}&extras=url_l&format=json&nojsoncallback=1`;
    const res = await fetch(url);
    const data = await res.json();
    const src = data.photos.photo[num].url_l;
    return src;
};

function getSlideNext() {
    if (+randomNum == 20) {
        randomNum = 1;
    }
    else {
        randomNum = +randomNum + 1;
    }
    checkSourse(randomNum);
}

function getSlidePrev() {
    if (+randomNum == 1) {
        randomNum = 20;
    }
    else {
        randomNum = +randomNum - 1;   
    } 
    checkSourse(randomNum);
}

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

//weather
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const weatherHumidity = document.querySelector('.humidity');
const windSpeed = document.querySelector('.wind');
const weatherErr = document.querySelector('.weather-error');

async function getWeather(city) {
    const currentCity = city || TRANSLATIONS[currentLanguage].CITYDEFAULT;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&lang=${TRANSLATIONS[currentLanguage].WEATHER}&appid=1cac88b1a4110319c96b4fc22457c7a7&units=metric`;
    const response = await fetch(url);
    const air = await response.json(); 
    if (air.cod == 404) {
        weatherErr.textContent = "Please, write correct city";
        temperature.textContent = ``;
        weatherDescription.textContent = ``;
        weatherHumidity.textContent = ``;
        windSpeed.textContent = ``;
    } else {
        weatherErr.textContent = "";
        temperature.textContent = `${Math.round(air.main.temp)}°C`;
        weatherDescription.textContent = `${air.weather[0].description}`;
        weatherHumidity.textContent = `${TRANSLATIONS[currentLanguage].HUMIDITY}: ${Math.round(air.main.humidity)}%`;
        windSpeed.textContent = `${TRANSLATIONS[currentLanguage].WIND}: ${Math.round(air.wind.speed)}m/s`;
    
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${air.weather[0].id}`);
    }
  }

  getWeather(localStorage.getItem('cityUser'));
  userCity.addEventListener('change', (e) => {
    getWeather(e.target.value);
  });
  
  //quotes
  const author = document.querySelector('.author');
  const quote = document.querySelector('.quote');
  const changeQ = document.querySelector('.change-quote');
  let quotes;

  async function getQuotes() {  
    const adress = TRANSLATIONS[currentLanguage].QUOTESJSON; 
    const result = await fetch(adress);
    quotes = await result.json(); 
    function getQuote() {
        let quoteNum = getRandomNum(0,quotes.length-1);
        author.textContent = quotes[quoteNum].author;
        quote.textContent = quotes[quoteNum].text;
  }
  getQuote();
  }
getQuotes();

changeQ.addEventListener('click', getQuotes);

//audio
const audio = new Audio();
const prevAudio = document.querySelector('.play-prev');
const nextAudio = document.querySelector('.play-next');
const play = document.querySelector('.play');
let isPlay = false;
const progress = document.querySelector('.progress');

playList.forEach((el, index) => {
const li = document.createElement('li');
const playListContainer = document.querySelector('.play-list')
li.classList.add('play-item');
li.textContent = playList[index].title;
playListContainer.append(li);
})

const liList = document.querySelectorAll('li');
const audioName = document.querySelector('.audio-name')
const nowTime = document.querySelector('.now');
const allTime = document.querySelector('.all');

let playNum = 0;
function playAudio() {
    audioName.textContent = playList[playNum].title;
    allTime.textContent = `/ ${playList[playNum].duration}`;
    audio.src = playList[playNum].src;
    if (!isPlay) {
        liList.forEach((el)=>{
            el.classList.remove('item-active');})
        liList[playNum].classList.add('item-active');
        audio.currentTime = progress.value;
        audio.play();
        isPlay = true;
        play.classList.add('pause');
    }
    else {
        audio.pause();
        isPlay = false;;
        play.classList.remove('pause');
        liList.forEach((el)=>{
            el.classList.remove('item-active');
        });
    }
}

function playnextAudio () {
    if (playNum === playList.length - 1) {
        playNum = 0;
        audio.src = playList[playNum].src;
    } else {
        playNum ++;
        audio.src = playList[playNum].src;
    }
    audioName.textContent = playList[playNum].title;
    allTime.textContent = `/ ${playList[playNum].duration}`;
    audio.currentTime = 0;
    audio.play();
    isPlay = true;
    play.classList.add('pause');
    liList.forEach((el)=>{
        el.classList.remove('item-active');})
    liList[playNum].classList.add('item-active');    
}

function playprevAudio () {              
    if(playNum === 0) {
        playNum = playList.length - 1;
        audio.src = playList[playList.length - 1].src;
    }
    else{
        playNum--;
        audio.src = playList[playNum].src;
    }
    audioName.textContent = playList[playNum].title;
    allTime.textContent = `/ ${playList[playNum].duration}`;
    audio.currentTime = 0;
    audio.play();
    isPlay = true;
    play.classList.add('pause');
    liList.forEach((el)=>{
        el.classList.remove('item-active');})
    liList[playNum].classList.add('item-active');   
}

audio.addEventListener('ended', playnextAudio);
play.addEventListener('click', playAudio);
prevAudio.addEventListener('click', playprevAudio);
nextAudio.addEventListener('click', playnextAudio);

//player pro

document.querySelector('#laught').oninput = laught;
const inp = document.querySelector('#laught');
const volume = document.querySelector('.volume');

function laught (){
    let v = this.value;
    audio.volume = v / 100;
    if (v == 0) {
        muteAudio();
    } else {
    volume.classList.remove('mute');
    }
}

function muteAudio() {
    if (volume.classList.contains('mute')) {
        audio.volume = inp.value / 100;
    }
    else {
    audio.volume = 0;
    }
    volume.classList.toggle('mute');
}

volume.addEventListener('click',  muteAudio);

audio.ontimeupdate = progressAudio;

function progressAudio () {
    if(isPlay) {
        let allT = audio.duration;
        let nowT = audio.currentTime;
        progress.value = nowT / allT * 100;
        nowTime.textContent = formatTime(nowT);
        function formatTime(seconds) {
            let min = Math.floor((seconds / 60));
            let sec = Math.floor(seconds - (min * 60));
            if (sec < 10){ 
                sec  = `0${sec}`;
            };
            return `0${min}:${sec}`;
        };
        if (progress.value == 100) {
            playnextAudio();
        }
    }
}


function WindV () {                                                         
    let w = this.offsetWidth;
    let o = event.offsetX;
    audio.pause();
    audio.currentTime = audio.duration * (o / w);
    audio.play();
}
progress.addEventListener('click', WindV);

//menu

const settingsBTN = document.querySelector('.settingsBTN');
const foot = document.querySelector('footer');
const menu = document.querySelector('.menu-settings');

const pLang = document.getElementById('p-lang');
const labelEn = document.getElementById('label-en');
const labelRu = document.getElementById('label-ru');
const pBg = document.getElementById('p-bg');
const pOpasity = document.getElementById('p-opasity');

const playerOpasity = document.getElementById('player-opasity');
const weatherOpasity = document.getElementById('weather-opasity');
const timeOpasity = document.getElementById('time-opasity');
const dateOpasity = document.getElementById('date-opasity');
const greetingOpasity = document.getElementById('greeting-opasity');
const quoteOpasity = document.getElementById('quote-opasity');

const arrDiv = document.querySelectorAll('.can-hide');
const arrInp = document.querySelectorAll('.hige-item');
const divHideSettings = document.querySelector('.hide-settings');

function addTextSettings () {
    pLang.textContent = TRANSLATIONS[currentLanguage].LANGSETTINGS;
    labelEn.textContent = TRANSLATIONS[currentLanguage].ENSETTINGS;
    labelRu.textContent = TRANSLATIONS[currentLanguage].RUSETTINGS;
    pBg.textContent = TRANSLATIONS[currentLanguage].BGSETTINGS;
    pOpasity.textContent = TRANSLATIONS[currentLanguage].OPASITYSETTINGS;
    playerOpasity.textContent = TRANSLATIONS[currentLanguage].PLAYERSETTINGS;
    weatherOpasity.textContent = TRANSLATIONS[currentLanguage].WEATHERSETTINGS;
    timeOpasity.textContent = TRANSLATIONS[currentLanguage].TIMESETTINGS;
    dateOpasity.textContent = TRANSLATIONS[currentLanguage].DATESETTINGS;
    greetingOpasity.textContent = TRANSLATIONS[currentLanguage].GREETINGSETTINGS;
    quoteOpasity.textContent = TRANSLATIONS[currentLanguage].QUOTESETTINGS;
}
addTextSettings();

function showMenu () {
    settingsBTN.classList.toggle('settingsBTN-active');
    foot.classList.toggle('footer-active');
    menu.classList.toggle('menu-active');
}

settingsBTN.addEventListener('click', showMenu);

function addOpasity(event) {
    if(event.target && event.target.tagName === 'INPUT' || event.target && event.target.tagName === 'LABEL') {
        arrInp.forEach((el, indx, arr) => {
            let num;
            if (el.checked) {
                num = +el.value;
                if (!arrDiv[num].classList.contains('opasity')) {
                    arrDiv[num].classList.add('opasity');
                } else {
                arrDiv[num].classList.remove('opasity');
                }
                localStorage.setItem(`checked${num}`, true);
            } else {
                num = +el.value;
                localStorage.removeItem(`checked${num}`);
            }
        });
    }
}

divHideSettings.addEventListener('click', addOpasity);

//localstorage

function checkInput() {
    if (localStorage.getItem('checked0')) {
        const i0 = document.getElementById('popasity');
        i0.setAttribute('checked','true');
    }
    if (localStorage.getItem('checked1')) {
        const i1 = document.getElementById('wopasity');
        i1.setAttribute('checked','true');
    }
    if (localStorage.getItem('checked2')) {
        const i2 = document.getElementById('topasity');
        i2.setAttribute('checked','true');
    }
    if (localStorage.getItem('checked3')) {
        const i3 = document.getElementById('dopasity');
        i3.setAttribute('checked','true');
    }
    if (localStorage.getItem('checked4')) {
        const i4 = document.getElementById('gopasity');
        i4.setAttribute('checked','true');
    }
    if (localStorage.getItem('checked5')) {
        const i5 = document.getElementById('qopasity');
        i5.setAttribute('checked','true');
    }
}
checkInput();

function checkOnLoad() {
    arrInp.forEach((el, indx, arr) => {
        let num;
        if (el.checked) {
            num = +el.value;
            if (!arrDiv[num].classList.contains('opasity')) {
                arrDiv[num].classList.add('opasity');
            } 
        }
    });
}    
checkOnLoad();

//img api
const checkBG = document.getElementById('BG');

function checkImputBg() {
    const inputs = document.querySelectorAll('.check-bg');
    const checkedValue = localStorage.getItem('url') || 'git';
    inputs.forEach(el => {
        if(el.value === checkedValue) {
            el.setAttribute('checked', true);
        }
    })
}
checkImputBg();

function getSourse(event) {
    if(event.target && event.target.tagName === 'INPUT' || event.target && event.target.tagName === 'LABEL') {
        if(event.target.value == 'unsplash') {
            localStorage.setItem('url', `unsplash`);
            checkSourse(randomNum)
        } 
        else if(event.target.value == 'flickr') {
            localStorage.setItem('url', 'flickr');
            checkSourse(randomNum);
        } else if (event.target.value == 'git') {
            localStorage.setItem('url', 'git');
            checkSourse(randomNum);
        }
    }
}

checkBG.addEventListener('click', getSourse);
