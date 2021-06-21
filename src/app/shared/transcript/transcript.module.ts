import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranscriptComponent } from './transcript/transcript.component';



@NgModule({
  declarations: [TranscriptComponent],
  imports: [
    CommonModule
  ],
  exports: [
    TranscriptComponent
  ]
})
export class TranscriptModule { }
