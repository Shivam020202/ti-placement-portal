import { useTheme } from "./ThemeProvider";

export const useStyledTheme = () => {
    const { theme } = useTheme();
    return theme; 
};
