import { createReturnStatement } from ".pnpm/mirrors.cloud.tencent.com+@vue+compiler-core@3.2.38/node_modules/@vue/compiler-core";
import {
  Component,
  DropdownComponent,
  ExtraButtonComponent,
  Setting,
  TextComponent,
  ToggleComponent,
} from "obsidian";
import { abstractEqual } from "src/utils";

interface SettingProps {
  name: string | DocumentFragment;
  desc?: string | DocumentFragment;
  tooltip?: string;
}

interface DropdownProps extends SettingProps {
  options: Record<string, string>;
}

type Payload = [
  value?: any,
  onChange?: (value: any) => void,
  defaultValue?: any
];

export function createSetting(
  container: HTMLElement,
  { name, desc, tooltip }: SettingProps
) {
  const setting = new Setting(container).setName(name);

  if (desc !== undefined) {
    setting.setDesc(desc);
  }

  if (tooltip !== undefined) {
    setting.setTooltip(tooltip);
  }

  return setting;
}

function componentSetup(setting: Setting, ...payload: Payload) {
  const [value, onChange, defaultValue] = payload;

  return (component: any) => {
    if (value !== undefined) {
      component.setValue(value);
      renderReset(value);
    }
    onChange &&
      component.onChange((value: any) => {
        onChange(value);
        renderReset(value);
      });

    function renderReset(value: any) {
      if (defaultValue === null) {
        return;
      }
      const resetSetting: Setting & {
        resetBtn: ExtraButtonComponent | null;
      } = setting as any;
      if (resetSetting.resetBtn && abstractEqual(defaultValue, value)) {
        resetSetting.resetBtn.extraSettingsEl.remove();
        resetSetting.resetBtn = null;
        return;
      }

      if (!abstractEqual(defaultValue, value)) {
        createReset(
          setting,
          defaultValue,
          () => {
            component.setValue(defaultValue);
            onChange && onChange(defaultValue);
            renderReset(defaultValue);
          },
          (c: any) => (resetSetting.resetBtn = c)
        );
      }
    }
  };
}

export function createText(
  container: HTMLElement,
  props: SettingProps,
  ...payload: Payload
) {
  const setting = createSetting(container, props);
  setting.addText(componentSetup(setting, ...payload));

  return setting;
}

export function createDropdown(
  container: HTMLElement,
  props: DropdownProps,
  ...payload: Payload
) {
  const setting = createSetting(container, props);
  setting.addDropdown((component) => {
    component.addOptions(props.options);
    componentSetup(setting, ...payload)(component);
  });

  return setting;
}

export function createToggle(
  container: HTMLElement,
  props: SettingProps,
  ...payload: Payload
) {
  const setting = createSetting(container, props);
  setting.addToggle(componentSetup(setting, ...payload));

  return setting;
}

export function createReset(
  setting: Setting,
  defaultValue: any,
  onChange: any,
  resolve: any
) {
  setting.addExtraButton((component) => {
    component.setIcon("reset");
    component.setTooltip("reset");
    component.onClick(onChange);
    resolve(component);
  });
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

export function createLink(
  el: HTMLElement | DocumentFragment,
  text: string,
  href: string
) {
  el.createEl(
    "a",
    {
      text,
      href,
    },
    (a) => {
      a.setAttr("target", "_blank");
    }
  );
}

export function createLines(lines: string[]) {
  return createFragment((frag) => {
    const len = lines.length - 1;
    for (let i = 0; i < len; i++) {
      const line = lines[i];
      frag.appendText(line);
      frag.appendChild(createEl("br"));
    } // for
    frag.appendText(lines[len]);
  });
}
