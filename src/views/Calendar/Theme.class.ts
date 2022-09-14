export interface ThemeProps {
  /**
   * Text color of the event element
   */
  color?: string;
  /**
   * Background color of the event element
   */
  backgroundColor?: string;
  /**
   * Background color of the dragging event element
   */
  dragBackgroundColor?: string;
  /**
   * Left border color of the event element
   */
  borderColor?: string;
  /**
   * Custom style for the event element
   */
  customStyle?: Record<string, string>;
}

export abstract class ThemeInfo implements ThemeProps {
  /**
   * Text color of the event element
   */
  color?: string;
  /**
   * Background color of the event element
   */
  backgroundColor?: string;
  /**
   * Background color of the dragging event element
   */
  dragBackgroundColor?: string;
  /**
   * Left border color of the event element
   */
  borderColor?: string;
  /**
   * Custom style for the event element
   */
  customStyle?: Record<string, string>;

  constructor() {}
}
