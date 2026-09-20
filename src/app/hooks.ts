import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Dùng các hooks này trong app thay vì useDispatch và useSelector mặc định
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
