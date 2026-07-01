// 设为 true 时 mockRequest 会抛错，用于演示错误路径
export const SIMULATE_ERROR = false;

const randomDelay = (): number => 300 + Math.floor(Math.random() * 501);

/**
 * Mock 请求封装：随机延迟 300～800ms，可选模拟失败，再执行 fn
 * 不做真实 fetch / 网络请求
 */
export const mockRequest = async <T>(fn: () => T | Promise<T>): Promise<T> => {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, randomDelay());
  });

  if (SIMULATE_ERROR) {
    throw new Error('Simulated API error');
  }

  return fn();
};
