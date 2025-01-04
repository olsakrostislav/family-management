import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsTaskbarCollabsed } from '@/state';

export const useTaskbar = () => {
  const dispatch = useAppDispatch();
  const isTaskbarCollabsed = useAppSelector(
    (state) => state.global.isTaskbarCollabsed
  );

  const toggleTaskbar = () => {
    dispatch(setIsTaskbarCollabsed(!isTaskbarCollabsed));
  };

  return { isTaskbarCollabsed, toggleTaskbar };
};
