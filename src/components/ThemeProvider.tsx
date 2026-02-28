"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";
type AccentColor = "Blue" | "Indigo" | "Violet" | "Emerald" | "Orange" | "Rose";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: "light" | "dark";
    accentColor: AccentColor;
    setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "dark",
    setTheme: () => { },
    resolvedTheme: "dark",
    accentColor: "Blue",
    setAccentColor: () => { },
});

export const useTheme = () => useContext(ThemeContext);

function getSystemTheme(): "light" | "dark" {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("dark");
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");
    const [accentColor, setAccentColorState] = useState<AccentColor>("Blue");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") as Theme | null;
        const storedAccent = localStorage.getItem("accent") as AccentColor | null;

        if (storedTheme) setThemeState(storedTheme);
        if (storedAccent) setAccentColorState(storedAccent);

        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const resolved = theme === "system" ? getSystemTheme() : theme;
        setResolvedTheme(resolved);

        const root = document.documentElement;
        if (resolved === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme, mounted]);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        // Remove existing accent classes
        const accents: AccentColor[] = ["Blue", "Indigo", "Violet", "Emerald", "Orange", "Rose"];
        accents.forEach(a => root.classList.remove(`accent-${a.toLowerCase()}`));

        // Add new accent class
        root.classList.add(`accent-${accentColor.toLowerCase()}`);
        localStorage.setItem("accent", accentColor);
    }, [accentColor, mounted]);

    // Listen for system theme changes
    useEffect(() => {
        if (theme !== "system") return;
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () => {
            const resolved = getSystemTheme();
            setResolvedTheme(resolved);
            const root = document.documentElement;
            if (resolved === "dark") {
                root.classList.add("dark");
            } else {
                root.classList.remove("dark");
            }
        };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const setAccentColor = (newAccent: AccentColor) => {
        setAccentColorState(newAccent);
    };

    // Prevent flash of wrong theme
    if (!mounted) {
        return <div style={{ visibility: "hidden" }}>{children}</div>;
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, accentColor, setAccentColor }}>
            {children}
        </ThemeContext.Provider>
    );
}
