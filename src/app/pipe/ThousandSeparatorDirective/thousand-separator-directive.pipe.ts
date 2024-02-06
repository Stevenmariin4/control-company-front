import { HostListener, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousandSeparatorDirective',
  standalone: true
})
export class ThousandSeparatorDirectivePipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    const parts = value.split('');
    let result = '';
    for (let i = 0; i < parts.length; i++) {
      result += parts[i];
      if ((parts.length - 1 - i) % 3 === 0 && i !== parts.length - 1) {
        result += '.'; // Agrega un punto después de cada grupo de tres dígitos
      }
    }
    return result;
  }

  @HostListener('input', ['$event']) onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\./g, ''); // Elimina todos los puntos
    const formattedValue = this.transform(value);
    input.value = formattedValue;
  }

}
