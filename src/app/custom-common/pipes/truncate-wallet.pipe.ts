import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateWallet'
})
export class TruncateWalletPipe implements PipeTransform {

  transform(value?: string|null, separator: string = '...', left: number = 6, right: number = 4): string {
    if (!value) return '';

    return [value.substring(0, left), separator, value.substring(value.length - right)].join("");
  }

}
