import { Component, ViewChild, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import videojs, { VideoJsPlayer } from 'video.js';
import { ApiService } from './services/api.service';
import { IVideo, ISubtitle} from './types/response';
import { TranscriptSearchPipe } from './pipes/transcript-search.pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('video', {static: true}) videoElement: ElementRef;
  private _player: VideoJsPlayer;
  private _activeTrack;
  private _curCueIndex: number = 0;
  public lang: string;
  public subtitles: Array<ISubtitle>;
  public activeCues: Array<TextTrackCue>;
  public cueTimes: Array<number> = [];
  public searchText: string;
  
  constructor(
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef,
    private transcriptSearch: TranscriptSearchPipe
  ) { }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this._player.width(document.getElementById(this._player.id()).parentElement.offsetWidth);
  }

  ngOnInit() {
    this.apiService.fetchVideo()
      .subscribe((res: IVideo) => {
        this.subtitles = res.subtitles;
        this.lang = this.subtitles[0].title;

        this._player = videojs(this.videoElement.nativeElement, {}, () => {
          this.buildVideoContainer(this._player, res);
          this.buildTranscript(this._player.textTracks());
          this._player.on('timeupdate', () => {
            this.setCue(this._player.currentTime());
          });
        });
      }, () => {
        throw new Error('Error fetchVideo!');
      });
  }

  ngOnDestroy() {
    if (this._player) {
      this._player.dispose();
    }
  }

  buildVideoContainer(player: VideoJsPlayer, data: IVideo) {
    player.src({ type: 'video/mp4', src: data.videoUrl });
    this.onResize();
    data.subtitles.forEach(subtitle => {
      const txtTrackOptions = {
        kind: 'captions' as TextTrackKind,
        label: subtitle.title,
        language: subtitle.title,
        src: subtitle.url
      }
      player.addRemoteTextTrack(txtTrackOptions, true);
    });
  }

  buildTranscript(tracks) {
    console.log('A: ', tracks);
    console.log('B: ', tracks.length);
    console.log('C: ', tracks[0]);
    this._activeTrack = tracks.tracks_.find(track => track.mode === 'showing') || tracks[0];
    this.activeCues = this._activeTrack.cues_;
  }

  onSubTitleChange(event: MatSelectChange) {
    this._activeTrack = this._player.textTracks()['tracks_'].find(track => track.language === event.value);
    this.activeCues = this._activeTrack.cues_;
    this.changeDetectorRef.detectChanges();
  }

  onCueChange(event: Array<number>) {
    this._player.currentTime(event[0]);
  }

  setCue(currentTime: number) {
    const cue_ = this.activeCues.find((cue, index) => {
      let end: number;
      if(index < this.activeCues.length - 1) {
        end = this.activeCues[index + 1]?.startTime;
      } else {
        end = this._player.duration() || Infinity;
      }
      if (currentTime >= cue.startTime && currentTime < end) {
        this._curCueIndex = index;
        return cue;
      }
    });
    this.cueTimes = [cue_?.startTime || 0];
  }

  onSearchTextChange(event) {
    this.searchText = event;
    if(this.searchText.length > 2) {
      this.activeCues = this.transcriptSearch.transform(this.activeCues, this.searchText);
    } else {
      this.activeCues = this._activeTrack.cues_;
    }
    this.cueTimes = [];
  }

  next() {
    this._player.currentTime(this.activeCues[this.cueTimes?.length ? this._curCueIndex + 1 : 0]?.startTime);
  }

  prev() {
    this._player.currentTime(this.activeCues[this.cueTimes?.length ? this._curCueIndex - 1 : 0]?.startTime);
  }

  clear() {
    this.activeCues = this._activeTrack.cues_;
    this.searchText = '';
  }

  /* Utils: Need to go to another file later on **/
  secondsToTime(timeInSeconds: number): string {
    const hour = Math.floor(timeInSeconds / 3600);
    const min = Math.floor(timeInSeconds % 3600 / 60);
    const sec = Math.floor(timeInSeconds % 60);

    const secStr = (sec < 10) ? '0' + sec : sec;
    const minStr = (hour > 0 && min < 10) ? '0' + min : min;

    if (hour > 0) {
      return hour + ':' + min + ':' + sec;
    }
    return minStr + ':' + secStr;
  }
}
