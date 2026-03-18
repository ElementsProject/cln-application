import '@testing-library/jest-dom';

jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');

  const mockMotionValue = (initial: any) => ({
    current: initial,
    prev: initial,
    get: () => initial,
    set: jest.fn(),
    on: jest.fn(),
    destroy: jest.fn(),
  });

  return {
    ...actual,
    useMotionValue: (initial: any) => mockMotionValue(initial),
    useSpring: (initial: any) => mockMotionValue(
      typeof initial === 'object' && initial !== null && 'current' in initial
        ? initial.current : initial
    ),
    useTransform: (v: any, inputOrTransformer: any, output?: any) => {
      if (typeof inputOrTransformer === 'function') {
        const val = typeof v === 'object' && v !== null && 'get' in v ? v.get() : v;
        return inputOrTransformer(val);
      }
      return Array.isArray(output) && output.length > 0 ? output[0] : 0;
    },
    useScroll: () => ({
      scrollX: mockMotionValue(0),
      scrollY: mockMotionValue(0),
      scrollXProgress: mockMotionValue(0),
      scrollYProgress: mockMotionValue(0),
    }),
    useVelocity: (v: any) => mockMotionValue(
      typeof v === 'object' && v !== null && 'get' in v ? v.get() : v
    ),
    useAnimation: () => ({ start: jest.fn(), stop: jest.fn(), set: jest.fn() }),
    useAnimationControls: () => ({ start: jest.fn(), stop: jest.fn(), set: jest.fn() }),
    useInView: () => false,
    useReducedMotion: () => true,
    useDragControls: () => ({ start: jest.fn() }),
    animate: jest.fn(() => ({ stop: jest.fn(), cancel: jest.fn(), then: jest.fn() })),
    scroll: jest.fn(),
    transform: (v: any) => v,
  };
});
