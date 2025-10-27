import { useEffect } from 'react';
import { Loader } from './ui/loader';

const FullScreenLoader = ({ isVisible }: { isVisible: boolean }) => {
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  return (
    isVisible && (
      <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-foreground z-50">
        <Loader />
      </div>
    )
  );
};

export default FullScreenLoader;
