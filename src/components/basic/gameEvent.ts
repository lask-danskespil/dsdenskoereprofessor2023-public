export default class GameEvent {
  private _name: string;
  private callback: Function;

  public constructor(name: string, callback: Function) {
    this._name = name;
    this.callback = callback;
  }

  public async run(): Promise<void> {
    await this.callback();
  }

  public get name(): string {
    return this._name;
  }
}
