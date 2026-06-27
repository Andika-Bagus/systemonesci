
import LogoWhite from "@/assets/images/syntax.png";
import LogoDark from "@/assets/images/syntax.png";
import { useTheme } from '@/components/theme-provider';

function ThemeLogo() {
  const { theme } = useTheme();
  if (!theme) return null;

  return (
      <img
        src={theme === "dark" ? LogoWhite : LogoDark}
        alt="Logo"
        width={168}
        height={40}
      />
  );
}

export default ThemeLogo;
