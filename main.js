const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $('.playlist');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const player = $('.player');
const playBtn = $('.btn-toggle-play');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const progress = $('#progress');
const PLAYER_STORAGE_KEY = 'NguyenHaiLy'

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRamdom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    songs: [
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: 'assets/music/Nevada.mp3',
            image: 'assets/image/1.JPG'
        }, {
            name: 'On The Ground',
            singer: 'Rosé',
            path: 'assets/music/On The Ground.mp3',
            image: 'assets/image/2.jpeg'
        }, {
            name: 'Gió',
            singer: 'Jank',
            path: 'assets/music/Gió.mp3',
            image: 'assets/image/3.jpg'
        }, {
            name: 'Suzume',
            singer: 'Suzume',
            path: 'assets/music/Suzume.mp3',
            image: 'assets/image/4.jpg'
        }, {
            name: 'I Want To You Know',
            singer: 'None',
            path: 'assets/music/I Want You To Know.mp3',
            image: 'assets/image/5.JPG'
        }, {
            name: 'Dusk Till Draw',
            singer: 'None',
            path: 'assets/music/Dusk Till Draw.mp3',
            image: 'assets/image/6.jpeg'
        }, {
            name: 'Pretty Girl',
            singer: 'None',
            path: 'assets/music/Pretty Girl.mp3',
            image: 'assets/image/7.jpeg'
        }, {
            name: '2 Phút Hơn',
            singer: 'None',
            path: 'assets/music/2 Phút Hơn.mp3',
            image: 'assets/image/8.jpeg'
        }, {
            name: 'AS IF ITS YOUR LAST',
            singer: 'None',
            path: 'assets/music/AS IF ITS YOUR LAST.mp3',
            image: 'assets/image/9.jpeg'
        }, {
            name: 'Như Anh Đã Thấy Em',
            singer: 'None',
            path: 'assets/music/Như Anh Đã Thấy Em.mp3',
            image: 'assets/image/10.jpeg'
        }, {
            name: 'Chờ Đợi Có Đáng Sợ',
            singer: 'None',
            path: 'assets/music/Chờ Đợi Có Đáng Sợ.mp3',
            image: 'assets/image/11.jpeg'
        }, {
            name: 'Phong Dạ Hành',
            singer: 'None',
            path: 'assets/music/Phong Dạ Hành.mp3',
            image: 'assets/image/12.jpeg'
        }, {
            name: 'Tháng Tư Là Lời Nói Dôi Của Em',
            singer: 'None',
            path: 'assets/music/Tháng Tư Là Lời Nói Dôi Của Em.mp3',
            image: 'assets/image/13.jpeg'
        }, {
            name: 'BoomBayah',
            singer: 'None',
            path: 'assets/music/BoomBayah.mp3',
            image: 'assets/image/14.jpeg'
        }, {
            name: 'Monody',
            singer: 'None',
            path: 'assets/music/Monody.mp3',
            image: 'assets/image/15.jpeg'
        }
    ],

    render: function () {
        const html = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = html.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },

    loadConfig: function(){
        this.isRamdom = this.config.isRamdom;
        this.isRepeat = this.config.isRepeat;
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    handleEvent: function () {
        const _this = this;
        // Xử lý phóng to thu nhỏ CD
        const cdWidth = cd.offsetWidth;

        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000, // 10 seconds
            iterations: Infinity, // iterations
        });
        cdThumbAnimate.pause();

        document.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const cdNewWidth = cdWidth - scrollTop;
            cd.style.width = cdNewWidth > 0 ? cdNewWidth + 'px' : 0;
            cd.style.opacity = cdNewWidth / cdWidth;
        },

        // Xử lý khi nhấn nút play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }else{
                audio.play();
            }
        },

        // Lắng nghe khi ấn nút play
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        },

        // Lắng nghe khi ấn nút pause
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Theo dõi thanh progress
        audio.ontimeupdate = () => {
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        },

        //Xử lý tua bài hát
        progress.onchange = (e) => {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        },

        //Khi next bài hát, setConfig
        nextBtn.onclick = () => {
            if(_this.isRamdom){
                _this.randomSong();
            }else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
        }

        //Khi prev bài hát
        prevBtn.onclick = () => {
            if(_this.isRamdom){
                _this.randomSong();
            }else{
                _this.prevSong();
            }
            audio.play();
        },

        //Xu ly bat tat random, setConfig
        randomBtn.onclick = function(e){
            _this.isRamdom = !_this.isRamdom;
            _this.setConfig('isRandom', _this.isRamdom);
            randomBtn.classList.toggle('active', _this.isRamdom);
        },

        // Xu ly khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }else if(_this.isRamdom){
                _this.randomSong();
                audio.play();
            }else{
                nextBtn.click();
            }
        },

        // Xu ly lap lai song
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        },

        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')){
                _this.currentIndex = Number(songNode.dataset.index);
                _this.loadCurrentSong();
                _this.render();
                audio.play();
            }else if(e.target.closest('.option')){
                alert('LYNH said: Tính năng chưa hoàn thiện ^^');
            }
        }

    },

    scrollToActiveSong: function(){

    },
    
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0 ){
            this.currentIndex = this.songs.length;
        }
        this.loadCurrentSong();
    },
    
    randomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong()
    }
    ,

    

    start: function () {

        // Gan cau hinh tu config vao App
        this.loadConfig();

        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        // Render Playlist
        this.render();

        // Tải bài hat đầu tiên vào UI
        this.loadCurrentSong();

        // Lắng nghe và xử lý sự kiện DOM event
        this.handleEvent();

        // Hien thi trang thai active cua btn ramdom va repeat
        repeatBtn.classList.toggle('active', this.isRepeat);
        repeatBtn.classList.toggle('active', this.isRepeat);
    },
}
app.start();