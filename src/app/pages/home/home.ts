import { Component, OnInit, signal } from '@angular/core';

const TEXT_FOR_CONSOLE = `Welcome to Nahu Dev Site V2!
This is a sample console text that will be displayed in the home component.`

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  fakeConsoleText = signal('');

  ngOnInit() {

    let index = 0;
    const textLength = TEXT_FOR_CONSOLE.length;

    setInterval(() => {

      if (index === 0) {
        this.fakeConsoleText.set(''); // Clear text at the start
      }

      if (index < textLength) {

        // delay to simulate typing effect
        if (index < 0) {
          index++;
          return;
        }

        this.fakeConsoleText.update(text => text + TEXT_FOR_CONSOLE[index]);
        index++;
      } else {

        index = 20 * -100; // Reset index to simulate a pause before starting again

      }


    }, 20);
  }

}
