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

  private badMoove : string = 'Mouvement interdit !';

  public countErrors : number = 0;
  public countMooves : number = 0;

  public vac: Vacuum = null;

  constructor(private _snackBar: MatSnackBar, private _communicateService: CommunicateService) { }

  ngOnInit(): void {
    // subscribe to observable to receive data from config component
    this._communicateService.subject$.subscribe((data: object) => {
      this.vac = null;
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
        this.vac.posX = line.indexOf(1);
        this.vac.posY = index;
      }
    })
  }

  /**
   * @name goUp
   * @todo goUp, goDown, goLeft, goRight may can be refactored
   * @return void
   */
  public goUp = (): void => {
    if (this.vac.posY + 1 >= 0 && this.vac.posY < this.board.length - 1) {
      let reverseBoard : Array<Array<number>> = this.board.slice().reverse();
      let line : Array<number> = reverseBoard[this.vac.posY];
      line[this.vac.posX] = 0;
      let newLine : Array<number> = reverseBoard[this.vac.posY + 1];
      this.vac.posY += 1;
      newLine[this.vac.posX] = 1;
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
    if (this.vac.posY - 1 >= 0 && this.vac.posY < this.board.length + 1) {
      let reverseBoard : Array<Array<number>> = this.board.slice().reverse();
      let line : Array<number> = reverseBoard[this.vac.posY];
      line[this.vac.posX] = 0;
      let newLine : Array<number> = reverseBoard[this.vac.posY - 1];
      this.vac.posY -= 1;
      newLine[this.vac.posX] = 1;
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
    if (this.vac.posX + 1 >= 0 && this.vac.posX < this.board[0].length - 1) {
      let reverseBoard : Array<Array<number>> = this.board.slice().reverse();
      let line : Array<number> = reverseBoard[this.vac.posY];
      line[this.vac.posX] = 0;
      line[this.vac.posX + 1] = 1;
      this.vac.posX += 1;
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
    if (this.vac.posX - 1 >= 0 && this.vac.posX < this.board[0].length) {
      let reverseBoard : Array<Array<number>> = this.board.slice().reverse();
      let line : Array<number> = reverseBoard[this.vac.posY];
      line[this.vac.posX] = 0;
      line[this.vac.posX - 1] = 1;
      this.vac.posX = this.vac.posX - 1;
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
    // create new Vacuum object
    this.vac = new Vacuum(Number(data.startX), Number(data.startY), data.orient, data.pattern);
    this.setPosition();
  }

  /**
   * @name setPosition
   * @description set the initial position
   * @param data Object
   * @return void
   */
  private setPosition = (): void => {
    let reverseBoard : Array<Array<number>> = this.board.slice().reverse();
    let line : Array<number> = reverseBoard[this.vac.posY];
    line[this.vac.posX] = 1;
    this.findPosition();
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
    for (let i = 0; i < this.vac.pattern.length; i++) {
      setTimeout(() => {
        if (this.vac.pattern[i] === 'A') {
          switch (this.vac.orient) {
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
          if (this.vac.orient === 'N') {
            this.vac.pattern[i] === 'D' ? this.vac.orient = 'E' : this.vac.orient = 'W';
          } else if (this.vac.orient === 'S') {
            this.vac.pattern[i] === 'D' ? this.vac.orient = 'W' : this.vac.orient = 'E';
          } else if (this.vac.orient === 'W') {
            this.vac.pattern[i] === 'D' ? this.vac.orient = 'N' : this.vac.orient = 'S';
          } else if (this.vac.orient === 'E') {
            this.vac.pattern[i] === 'D' ? this.vac.orient = 'S' : this.vac.orient = 'N';
          }
        }
        this.countMooves ++;
      }, i * 500);
    }
  }
}

/**
 * @class Vacuum
 * @description this class contains setter and getter of vaccum, in the future we will be able to instantiate multiple Vacuum in the grid
 */
class Vacuum {
  private x : number = 0;
  private y : number = 0;
  private orientation : string = '';
  public pattern : Array<string> = [];

  constructor(initalX: number, initialY: number, initOrient: string, patternArr: Array<string>) {
    this.x = initalX;
    this.y = initialY;
    this.orientation = initOrient;
    this.pattern = patternArr;
  }

  public set posX (value: number) {
    this.x = value;
  }
  public get posX() {
    return this.x;
  }

  public set posY (value: number) {
    this.y = value;
  }
  public get posY() {
    return this.y;
  }

  public set orient (value: string) {
    this.orientation = value;
  }
  public get orient() {
    return this.orientation;
  }
  
}
