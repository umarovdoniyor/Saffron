import store from "../../store/store";
import { Provider } from "react-redux";
import { loadUser } from "../../store/slices/authSlice";

interface LayoutProps {
  children?: React.ReactNode;
}

// Load user synchronously before rendering
store.dispatch(loadUser());

const ReduxWrapper = ({ children }: LayoutProps) => {
  return (
    <>
      <Provider store={store}>{children}</Provider>
    </>
  );
};

export default ReduxWrapper;
