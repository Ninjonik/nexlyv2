"use client"

import { useState, useEffect } from "react";
import { FaSun, FaMoon } from 'react-icons/fa';


export const ThemeSelector = () => {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
    );

    const handleToggle = (e: { target: { checked: boolean; }; }) => {
        if (e.target.checked) {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };

    useEffect(() => {
        // @ts-ignore
        localStorage.setItem("theme", theme);
        const localTheme = localStorage.getItem("theme");
        // @ts-ignore
        document.querySelector("html").setAttribute("data-theme", localTheme);
    }, [theme]);

    return (
            <button className="btn btn-square btn-ghost flex justify-center items-center text-center h-full">
                <label className="swap swap-rotate">
                    <input
                        type="checkbox"
                        onChange={handleToggle}
                        checked={theme === "light" ? false : true}
                    />
                    <FaSun className="w-8 h-8 swap-on" />
                    <FaMoon className="w-8 h-8 swap-off" />
                </label>
            </button>
    );
};