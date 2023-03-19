/**
 * @author Junaid Atari
 * @link https://gist.github.com/blacksmoke26/65f35ee824674e00d858047e852bd270
 *
 * Modified by AgainPsychoX to use TypeScript and `use-debounce` package.
 * Modified by Shahana to remove `use-debounce` package and use enums.
 */

import { useState, useEffect } from 'react';
import { Breakpoints } from '../utilities/constants';

const resolveBreakpoint = (width: number): Breakpoints => {
  if (width < 576) return Breakpoints.XS;
  if (width < 768) return Breakpoints.SM;
  if (width < 992) return Breakpoints.MD;
  if (width < 1200) return Breakpoints.LG;
  if (width < 1440) return Breakpoints.XL;
  return Breakpoints.XXL;
};

const useBreakpoint = () => {
  const [size, setSize] = useState(() => resolveBreakpoint(window.innerWidth));

  useEffect(() => {
    const update = () => {
      return setTimeout(() => {
        return setSize(resolveBreakpoint(window.innerWidth));
      }, 200);
    };

    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return size;
};

export default useBreakpoint;
