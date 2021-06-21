import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { TranscriptSearchPipe } from './pipes/transcript-search.pipe';
import { VideoPlayerModule } from './shared/video-player/video-player.module';
import { TranscriptModule } from './shared/transcript/transcript.module';

@NgModule({
  declarations: [
    AppComponent,
    TranscriptSearchPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatListModule,
    MatButtonModule,
    FormsModule,
    VideoPlayerModule,
    TranscriptModule
  ],
  providers: [TranscriptSearchPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
