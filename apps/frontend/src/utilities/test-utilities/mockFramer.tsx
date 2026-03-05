import React from 'react';

const motion = new Proxy(
  {},
  {
    get: (_target, tag: string) => {
      const Component = ({ children, ...props }: any) =>
        React.createElement(tag, props, children);
      Component.displayName = `motion.${tag}`;
      return Component;
    },
  }
);

const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const useMotionValue = (initial: number) => {
  const value = { get: () => initial, set: jest.fn(), current: initial, prev: initial };
  return value;
};

const useTransform = (_value: any, transformer: (v: number) => any) => ({
  get: () => transformer(0),
});

const animate = jest.fn(() => ({ stop: jest.fn() }));

const useAnimation = () => ({ start: jest.fn(), stop: jest.fn() });
const useReducedMotion = () => false;

export {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
  useAnimation,
  useReducedMotion,
};
