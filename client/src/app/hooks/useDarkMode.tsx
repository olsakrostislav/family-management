import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsDarkMode } from '@/state';

export const useDarkMode = () => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  return { isDarkMode, toggleDarkMode };
};
