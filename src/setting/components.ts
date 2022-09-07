import { Component, Setting } from "obsidian";

interface SettingProps {
  name: string | DocumentFragment;
  desc?: string | DocumentFragment;
}

interface DropdownProps extends SettingProps {
  options: Record<string, string>;
}

export function createSetting(
  container: HTMLElement,
  { name, desc }: SettingProps
) {
  const setting = new Setting(container).setName(name);

  if (desc !== undefined) {
    setting.setDesc(desc);
  }

  return setting;
}

export function createText(
  container: HTMLElement,
  props: SettingProps,
  value?: string,
  onChange?: (value: string) => void
) {
  const setting = createSetting(container, props);
  setting.addText((component) => {
    if (value !== undefined) {
      component.setValue(value);
      onChange && component.onChange(onChange);
    }
  });

  return setting;
}

export function createDropdown(
  container: HTMLElement,
  props: DropdownProps,
  value?: string,
  onChange?: (value: string) => void
) {
  const setting = createSetting(container, props);
  setting.addDropdown((component) => {
    component.addOptions(props.options);
    if (value !== undefined) {
      component.setValue(value);
      onChange && component.onChange(onChange);
    }
  });

  return setting;
}

export function createToggle(
  container: HTMLElement,
  props: SettingProps,
  value?: boolean,
  onChange?: (value: boolean) => void
) {
  const setting = createSetting(container, props);
  setting.addToggle((component) => {
    if (value !== undefined) {
      component.setValue(value);
      onChange && component.onChange(onChange);
    }
  });

  return setting;
}

export function createDetails(
  container: HTMLElement,
  name: string,
  open: boolean = true
) {
  const attr: any = {};
  if (open) {
    attr.open = open;
  }
  const details = container.createEl("details", {
    cls: "calendar-details",
    attr,
  });
  const summary = details.createEl("summary", { cls: "calendar-summary" });
  summary.createEl("strong", { text: name });

  const content = details.createEl("div");

  return {
    details,
    summary,
    content,
  };
}
