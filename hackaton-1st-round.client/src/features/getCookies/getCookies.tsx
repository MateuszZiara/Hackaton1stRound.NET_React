import { useEffect } from "react";

export async function checkUserLoggedIn() {
    const response = await fetch("https://localhost:7071/api/AspNetUsers/info", {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true'
        }
    });

    if (response.ok) {
        return true;
    } else {
        return false;
    }
}

export async function logout() {
    const response = await fetch("https://localhost:7071/api/AspNetUsers/logout", {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true'
        }
    });
    window.location.href = "/pag";
}

export function useRedirectIfLoggedIn() {
    useEffect(() => {
        const redirectIfLoggedIn = async () => {
            const isLoggedIn = await checkUserLoggedIn();
            if (isLoggedIn) {
                window.location.href = "/main"; // Przekierowanie do "/main" w przypadku sukcesu
            }
        };
        redirectIfLoggedIn();
    }, []);
}
