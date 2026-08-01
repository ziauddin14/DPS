import AppRoutes from './routes/AppRoutes';
import { SettingsProvider } from './context/SettingsContext';

/**
 * App — root component.
 * Delegates all rendering and routing to AppRoutes.
 */
function App() {
  return (
    <SettingsProvider>
      <AppRoutes />
    </SettingsProvider>
  );
}

export default App;
