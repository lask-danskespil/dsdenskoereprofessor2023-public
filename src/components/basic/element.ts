import { Location } from "./location";

export class Element {
  public name: string;
  public id: number;
  public position: any;
  public width: number;
  public height: number;
  public locations: Location[];
}