import { ref } from "vue";

export function useToggle(initial = false) {
  const toggle = ref<boolean>(initial);

  return {
    toggle,
    onToggle(target?: boolean) {
      if (target !== undefined) {
        toggle.value = target;
        return;
      }

      toggle.value = !toggle.value;
    },
  };
}
