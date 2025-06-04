import {hideToast, showToast} from '@slices/toast';
import {useDispatch} from 'react-redux';

const useToast = () => {
  const dispatch = useDispatch();

  const triggerToast = (message, type = 'success') => {
    dispatch(showToast({message, type}));
  };

  const closeToast = () => {
    dispatch(hideToast());
  };

  return {triggerToast, closeToast};
};

export default useToast;
