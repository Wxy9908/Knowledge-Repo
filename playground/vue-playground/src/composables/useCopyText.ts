import { ref } from 'vue';

export const useCopyText = (resetMs = 2000) => {
  const copied = ref(false);
  let timer: number | null = null;

  const copy = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      copied.value = true;
      if (timer !== null) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        copied.value = false;
        timer = null;
      }, resetMs);
      return true;
    } catch {
      copied.value = false;
      return false;
    }
  };

  return { copied, copy };
};
