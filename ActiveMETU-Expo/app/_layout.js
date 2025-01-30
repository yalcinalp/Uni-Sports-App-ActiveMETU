import { useAxiosConfig } from 'Utils/axiosConfig';
import { SessionProvider } from 'Utils/auth/ctx';
import { Slot } from 'expo-router';

// Axios config should be after SessionProvider
function AppContent() {
  useAxiosConfig();
  return <Slot />;
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <AppContent />
    </SessionProvider>
  );
}
