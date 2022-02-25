import playList from './playList.js';
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
