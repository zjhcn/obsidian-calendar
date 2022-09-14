import { ThemeInfo } from "./Theme.class";

export class CalendarInfo extends ThemeInfo {
  /**
   * use name
   */
  readonly id: string;
  /**
   * `Optional` unique name for various use
   */
  readonly name: string;
  isVisible?: boolean = true;

  constructor(id: string) {
    super();
    this.id = id;
    this.name = id;
  }
}
