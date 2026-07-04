import { Nav } from "./Nav";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  darkHero?: boolean;
}

export default function Layout({
  children,
  showHeader = true,
  showFooter = true,
  darkHero = false,
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Nav darkHero={darkHero} />}
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
