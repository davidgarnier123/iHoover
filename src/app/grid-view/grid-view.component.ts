import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { CommunicateService } from '../shared/services/communicate.service';

@Component({
  selector: 'app-grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.less']
})
export class GridViewComponent implements OnInit {

  public board : Array<Array<number>> = [];
  public x = 0;
  public y = 0;
  public orientation : string = '';

  public pattern : Array<string> = [];

  private badMoove : string = 'Mouvement interdit !';

  public countErrors : number = 0;
  public countMooves : number = 0;

  constructor(private _snackBar: MatSnackBar, private _communicateService: CommunicateService) { }

  ngOnInit(): void {
    // subscribe to observable to receive data from config component
    this._communicateService.subject$.subscribe((data: object) => {
      this.generateGrid(data);
    })
  }

  /**
   * @name findPosition
   * @description find the current x y coordinate
   * @return void
   */
  private findPosition = (): void => {
    let reverseBoard = this.board.slice().reverse();
    reverseBoard.forEach((line, index) => {
      if (line.includes(1)) {
        this.x = line.indexOf(1);
        this.y = index;
      }
    })
  }

  /**
   * @name goUp
   * @todo goUp, goDown, goLeft, goRight may can be refactored
   * @return void
   */
  public goUp = (): void => {
    if (this.y + 1 >= 0 && this.y < this.board.length - 1) {
      let reverseBoard : Array<Array<number>> = this.board.slice().reverse();
      let line : Array<number> = reverseBoard[this.y];
      line[this.x] = 0;
      let newLine : Array<number> = reverseBoard[this.y + 1];
      this.y += 1;
      newLine[this.x] = 1;
    } else {
      this.countErrors++;
      console.error('Mouvement interdit !');
      this.errorSnack();
    }
  }

  /**
   * @name goDown
   * @todo goUp, goDown, goLeft, goRight may can be refactored
   * @return void
   */
  public goDown = (): void => {
    if (this.y - 1 >= 0 && this.y < this.board.length + 1) {
      let reverseBoard : Array<Array<number>> = this.board.slice().reverse();
      let line : Array<number> = reverseBoard[this.y];
      line[this.x] = 0;
      let newLine : Array<number> = reverseBoard[this.y - 1];
      this.y -= 1;
      newLine[this.x] = 1;
    } else {
      this.countErrors++;
      console.error('Mouvement interdit !');
      this.errorSnack();
    }
  }

  /**
   * @name goRight
   * @todo goUp, goDown, goLeft, goRight may can be refactored
   * @return void
   */
  public goRight = (): void => {
    if (this.x + 1 >= 0 && this.x < this.board[0].length - 1) {
      let reverseBoard : Array<Array<number>> = this.board.slice().reverse();
      let line : Array<number> = reverseBoard[this.y];
      line[this.x] = 0;
      line[this.x + 1] = 1;
      this.x += 1;
    } else {
      this.countErrors++;
      console.error('Mouvement interdit !');
      this.errorSnack();
    }
  }

  /**
   * @name goLeft
   * @todo goUp, goDown, goLeft, goRight may can be refactored
   * @return void
   */
  public goLeft = (): void => {
    if (this.x - 1 >= 0 && this.x < this.board[0].length) {
      let reverseBoard : Array<Array<number>> = this.board.slice().reverse();
      let line : Array<number> = reverseBoard[this.y];
      line[this.x] = 0;
      line[this.x - 1] = 1;
      this.x -= 1;
    } else {
      this.countErrors++;
      console.error('Mouvement interdit !');
      this.errorSnack();
    }
  }

  /**
   * @name errorSnack
   * @description open snackbar with error when bad moove is detected
   * @return void
   */
  private errorSnack = (): void => {
    this._snackBar.open(this.badMoove, null, {
      duration: 2000,
      panelClass: ['red-snackbar'],
    });
  }

  /**
   * @name generateGrid
   * @description generate grid to push in array with received data from config
   * @param data Object
   * @return void
   */
  private generateGrid = (data): void => {
    this.board = [];
    for (let i = 0; i < data.row; i++) {
      let line : Array<number> = Array(Number(data.col)).fill(0);
      this.board.push(line);
    }
    this.setPosition(data);
  }

  /**
   * @name setPosition
   * @description set the initial position
   * @param data Object
   * @return void
   */
  private setPosition = (data): void => {
    this.orientation = data.orient;
    let reverseBoard : Array<Array<number>> = this.board.slice().reverse();
    let line : Array<number> = reverseBoard[data.startY];
    line[data.startX] = 1;
    this.findPosition();
    this.pattern = data.pattern;
    setTimeout(() => {
      this.runPattern();      
    }, 1000);
  }

  /**
   * @name runPattern
   * @description loop through the pattern array to make action every seconds
   * @return void
   */
  private runPattern = (): void => {
    this.countErrors = 0;
    this.countMooves = 0;
    for (let i = 0; i < this.pattern.length; i++) {
      setTimeout(() => {
        if (this.pattern[i] === 'A') {
          switch (this.orientation) {
            case 'N':
              this.goUp();
              break;
            case 'S':
              this.goDown();
              break;
            case 'E':
              this.goRight();
              break;
            case 'W':
              this.goLeft();
              break;
          }
        } else {
          if (this.orientation === 'N') {
            this.pattern[i] === 'D' ? this.orientation = 'E' : this.orientation = 'W';
          } else if (this.orientation === 'S') {
            this.pattern[i] === 'D' ? this.orientation = 'W' : this.orientation = 'E';
          } else if (this.orientation === 'W') {
            this.pattern[i] === 'D' ? this.orientation = 'N' : this.orientation = 'S';
          } else if (this.orientation === 'E') {
            this.pattern[i] === 'D' ? this.orientation = 'S' : this.orientation = 'N';
          }
        }
        this.countMooves ++;
      }, i * 500);
    }
  }
}
