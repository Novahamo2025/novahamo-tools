import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CursorGlow from '../components/CursorGlow';
import { useTheme } from '../hooks/useTheme';

export default function MainLayout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <CursorGlow />
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
