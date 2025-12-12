import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationPrompt = ({ when, message }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!when) return;

    // Add beforeunload event listener
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [when, message]);

  useEffect(() => {
    if (!when) return;

    // Handle route changes
    const unblock = navigate((nextLocation) => {
      if (!when) return true;

      if (window.confirm(message)) {
        return true;
      }
      return false;
    });

    return unblock;
  }, [when, message, navigate]);

  return null;
};

export default NavigationPrompt;