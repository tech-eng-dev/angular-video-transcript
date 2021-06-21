import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'transcriptSearch'
})
export class TranscriptSearchPipe implements PipeTransform {
  public transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText || searchText?.length < 3 ) return items;
  
    return items.filter(item => {
      return Object.keys(item).some(key => {
        return String(item[key]).toLowerCase().includes(searchText.toLowerCase());
      });
    });
   }
}
