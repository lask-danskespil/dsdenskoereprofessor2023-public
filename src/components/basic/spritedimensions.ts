export class SpriteDimensions {
  public name: string;
  public id: number;
  public x: number;
  public y: number;
  public position: any;
  public width: number;
  public height: number;

  public constructor(name: string, id: number, position: any, width: number, height: number) {
    this.name = name;
    this.id = id;
    this.position = position;
    this.x = Math.floor(position.x - width/2);
    this.y = Math.floor(position.y - height/2);
    this.width = width;
    this.height = height;
  }
}