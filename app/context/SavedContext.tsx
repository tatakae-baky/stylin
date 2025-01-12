import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface SavedItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: any;
  brandName?: string;
  brandLogo?: any;
}

interface SavedState {
  items: { [key: string]: SavedItem };
}

type SavedAction = 
  | { type: 'TOGGLE_SAVE'; payload: SavedItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } };

const initialState: SavedState = {
  items: {},
};

function savedReducer(state: SavedState, action: SavedAction): SavedState {
  switch (action.type) {
    case 'TOGGLE_SAVE':
      const itemExists = state.items[action.payload.id];
      if (itemExists) {
        const newItems = { ...state.items };
        delete newItems[action.payload.id];
        return { ...state, items: newItems };
      } else {
        return {
          ...state,
          items: {
            ...state.items,
            [action.payload.id]: action.payload,
          },
        };
      }
    case 'REMOVE_ITEM':
      const updatedItems = { ...state.items };
      delete updatedItems[action.payload.id];
      return { ...state, items: updatedItems };
    default:
      return state;
  }
}

const SavedContext = createContext<{
  state: SavedState;
  dispatch: React.Dispatch<SavedAction>;
} | undefined>(undefined);

export function SavedProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(savedReducer, initialState);

  return (
    <SavedContext.Provider value={{ state, dispatch }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const context = useContext(SavedContext);
  if (context === undefined) {
    throw new Error('useSaved must be used within a SavedProvider');
  }
  return context;
}

export default SavedContext; 