import { useRoutes } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import { routes } from './routes';
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import AuthPersist from '@/components/auth/AuthPersist';
import { RecoilRoot } from 'recoil';

const App = () => {
  const routing = useRoutes(routes);

  return (
    <RecoilRoot>
      <AuthPersist>
        <ToastProvider>
          <ErrorBoundary>
            {routing}
          </ErrorBoundary>
          <ToastViewport className="toast-viewport" />
        </ToastProvider>
      </AuthPersist>
    </RecoilRoot>
  );
};

export default App;