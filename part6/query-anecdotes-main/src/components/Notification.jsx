import React, { useReducer, useContext, createContext, useEffect } from 'react';

const NotificationContext = createContext();

const initialState = {
  message: '',
  isVisible: false,
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return {
        message: action.message,
        isVisible: true,
      };
    case 'HIDE_NOTIFICATION':
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

const Notification = () => {
  const { state, dispatch } = useNotification();

  useEffect(() => {
    if (state.isVisible) {
      const timer = setTimeout(() => {
        dispatch({ type: 'HIDE_NOTIFICATION' });
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [state.isVisible, dispatch]);

  if (!state.isVisible) {
    return null;
  }

  return (
    <div style={style}>
      {state.message}
    </div>
  );
};

const style = {
  border: 'solid',
  padding: 10,
  borderWidth: 1,
  marginBottom: 5,
};

export default Notification;
