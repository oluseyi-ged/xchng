import {hideToast, showToast} from '@slices/toast';
import {useDispatch} from 'react-redux';

const useToast = () => {
  const dispatch = useDispatch();

  const triggerToast = (title: string, message: string, type = 'success') => {
    dispatch(hideToast());

    setTimeout(() => {
      dispatch(showToast({title, message, type}));
    }, 300);
  };

  const closeToast = () => {
    dispatch(hideToast());
  };

  return {triggerToast, closeToast};
};
