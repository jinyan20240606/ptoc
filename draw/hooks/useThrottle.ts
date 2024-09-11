import React from "react";

/**
 * REACT状态更新节流
 * 这个Hook可以用来限制状态更新的频率，确保在指定的时间间隔内只进行一次状态更新
 * @param value 
 * @param interval 
 * @returns 
 */
export function useThrottle(value: string, interval = 500) {
  const [throttledValue, setThrottledValue] = React.useState(value);
  const lastUpdated = React.useRef<number | null>(null);

  React.useEffect(() => {
    // 是与当前窗口打开时的时间差毫秒
    const now = performance.now();

    // !lastUpdated.current 最先运行，表示首次执行为null的情况
    // 首次为true肯定失败走else，初次就延时interval执行
    // 后续在正常判断大于间隔渲染，否则设定延时interval执行，除非下次更新销毁
    if (!lastUpdated.current || now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const id = window.setTimeout(() => {
        lastUpdated.current = now;
        setThrottledValue(value);
      }, interval);

      return () => window.clearTimeout(id);
    }
  }, [value, interval]);

  return throttledValue;
}
export default useThrottle;
