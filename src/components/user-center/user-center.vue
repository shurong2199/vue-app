<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <!-- [我喜欢的 | 最近听的] -->
        <switches @switch="switchItem" :switches="switches" :activeIndex="activeIndex" />
      </div>
      <div ref="playBtn" class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <!-- 我喜欢的 List -->
        <scroll ref="favoriteList" class="list-scroll" v-if="activeIndex===0" :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong" />
          </div>
        </scroll>
        <!-- 最近听的 List -->
        <scroll ref="playList" class="list-scroll" v-if="activeIndex===1" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong" />
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc" />
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Switches from 'base/switches/switches';
  import Scroll from 'base/scroll/scroll';
  import SongList from 'base/song-list/song-list';
  import NoResult from 'base/no-result/no-result';
  import Song from 'common/js/song';
  import {mapGetters, mapActions} from 'vuex';
  import {playlistMixin} from 'common/js/mixin';

  export default {
    mixins: [playlistMixin],

    data() {
      return {
        activeIndex: 0,
        switches: [
          {name: '我喜欢的'},
          {name: '最近听的'}
        ]
      };
    },

    computed: {
      noResult() {
        return !this[this.activeIndex === 0 ? 'favoriteList' : 'playHistory'].length;
      },
      noResultDesc() {
        return this.activeIndex === 0 ? '暂无收藏歌曲' : '你还没有听过歌曲';
      },
      ...mapGetters([
        'favoriteList',
        'playHistory'
      ])
    },

    methods: {
      // implement handlePlaylist of playlistMixin
      handlePlaylist(playlist) {
        this.$refs.listWrapper.style.bottom = playlist.length > 0 ? '60px' : '';
        this.$refs.favoriteList && this.$refs.favoriteList.refresh();
        this.$refs.playList && this.$refs.playList.refresh();
      },
      switchItem(index) {
        this.activeIndex = index;
      },
      selectSong(song) {
        this.insertSong(new Song(song));
      },
      back() {
        this.$router.back();
      },
      random() {
        let list = this.activeIndex === 0 ? this.favoriteList : this.playHistory;
        if (list.length === 0) {
          return;
        }
        list = list.map((song) => new Song(song));
        this.randomPlay({
          list
        });
      },
      ...mapActions([
        'insertSong',
        'randomPlay'
      ])
    },

    components: {
      Switches,
      Scroll,
      SongList,
      NoResult
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>