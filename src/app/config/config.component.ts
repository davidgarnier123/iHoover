import { Component, OnInit } from '@angular/core';
import { CommunicateService } from '../shared/services/communicate.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.less']
})
export class ConfigComponent implements OnInit {

  public orientControl: Array<{ type: string, text: string }> = [
    {
      type: 'N',
      text: 'Nord'
    },
    {
      type: 'E',
      text: 'Est'
    },
    {
      type: 'S',
      text: 'Sud'
    },
    {
      type: 'W',
      text: 'Ouest'
    },
  ];

  public grid: { col: number, row: number, startX: number, startY: number, orient: string, pattern: Array<string> } = {
    col: 0,
    row: 0,
    startX: 0,
    startY: 0,
    orient: 'N',
    pattern: []
  }

  constructor(private _communicateService: CommunicateService) { }

  ngOnInit(): void {
  }

  /**
   * @name onKey
   * @description receive keyUp event with type name to set initials value
   * @param event Event
   * @param type string
   * @return void
   */
  public onKey = (event, type: string): void => {
    const value = event.target.value;
    switch (type) {
      case 'col':
        this.grid.col = value;
        break;
      case 'row':
        this.grid.row = value;
        break;
      case 'initX':
        this.grid.startX = value;
        break;
      case 'initY':
        this.grid.startY = value;
        break;
    }
  }

  /**
   * @name addToPattern
   * @description add action to array or delete last element
   * @param type String
   * @return void
   */
  public addToPattern = (type: string) => {
    switch (type) {
      case 'right':
        this.grid.pattern.push('D');
        break;
      case 'left':
        this.grid.pattern.push('G');
        break;
      case 'walk':
        this.grid.pattern.push('A');
        break;
      case 'delete':
        this.grid.pattern.pop();
        break;
    }
  }

  /**
   * @name setInitOrient
   * @description set the initial orientation when user click
   * @param type String
   * @return void
   */
  public setInitOrient = (type: string): void => {
    this.grid.orient = type;
  }

  /**
   * @name start
   * @description send grid config to grid component
   * @return void
   */
  public start = (): void => {
    this._communicateService.start(this.grid);
  }

  /**
   * @name isInteger
   * @description check if value is integer
   * @param num string
   * @returns boolean
   */
  public isInteger = (num: any): boolean => {
    return Number.isInteger(Number(num))
  }

}
