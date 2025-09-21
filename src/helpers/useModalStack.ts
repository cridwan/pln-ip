import { ref } from "vue";

const baseZ = 9999;
const counter = ref(0);

export function useModalStack() {
  counter.value++;
  const overlayZ = baseZ + counter.value * 2;
  const contentZ = baseZ + counter.value * 2 + 1;

  return { overlayZ, contentZ };
}
