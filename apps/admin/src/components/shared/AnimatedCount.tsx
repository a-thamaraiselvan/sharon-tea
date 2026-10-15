import React, { useEffect, useState, useRef } from 'react';

export interface AnimatedCountProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  formatter?: (val: number) => string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * AnimatedCount
 * Smoothly animates numeric counters using requestAnimationFrame and ease-out cubic interpolation.
 */
export const AnimatedCount: React.FC<AnimatedCountProps> = ({
  value,
  duration = 1000,
  prefix = '',
  suffix = '',
  decimals = 0,
  formatter,
  className,
  style,
}) => {
  const isReducedMotion = (): boolean => {
    return (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  };

  const [displayValue, setDisplayValue] = useState<number>(() => {
    return isReducedMotion() ? value : 0;
  });

  const prevValueRef = useRef<number | null>(null);
  const currentDisplayRef = useRef<number>(displayValue);
  const startValRef = useRef<number>(0);
  const targetValRef = useRef<number>(value);
  const startTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Prevent restarting animation if value hasn't actually changed
    if (prevValueRef.current === value) {
      return;
    }

    // Cancel any active animation frame
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    // Respect prefers-reduced-motion: reduce by immediately setting target value
    if (isReducedMotion()) {
      prevValueRef.current = value;
      currentDisplayRef.current = value;
      setDisplayValue(value);
      return;
    }

    // Determine start value (0 on initial mount, current display value on update)
    const start = prevValueRef.current === null ? 0 : currentDisplayRef.current;
    startValRef.current = start;
    targetValRef.current = value;
    prevValueRef.current = value;
    startTimeRef.current = null;

    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const current =
        startValRef.current + (targetValRef.current - startValRef.current) * easedProgress;

      if (progress < 1) {
        currentDisplayRef.current = current;
        setDisplayValue(current);
        rafIdRef.current = requestAnimationFrame(animate);
      } else {
        currentDisplayRef.current = targetValRef.current;
        setDisplayValue(targetValRef.current);
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [value, duration]);

  const formattedNumber = formatter
    ? formatter(displayValue)
    : decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.round(displayValue).toLocaleString();

  return (
    <span className={className} style={style}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};

export default AnimatedCount;

