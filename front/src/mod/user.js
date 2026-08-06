const BASE_URL = import.meta.env.VITE_API_URL;

export function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

export async function login (username, password){
    try {
        const response = await fetch( `${BASE_URL}users/login/`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                username: username,
                password: password
            }),
        });

        const data = await response.json()

        if (!response.ok){
            throw new Error(data.detail || "Login failed");
        }

        return data;

    } catch (error){
        throw error
    }
}

export async function get_logged_user(){
    const cached = localStorage.getItem("logged_user")
    if (cached) return JSON.parse(cached);

    const access_token = getCookie("access_token")

    try {
        const response = await fetch( `${BASE_URL}users/me`, {
            credentials: "include",
            headers: {
                Authorization : `Bearer ${access_token}`
            }
        });

        if (!response.ok){
            throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        localStorage.setItem("logged_user", JSON.stringify(data));
        return data;

    } catch (err) {
        console.log(err);
        return null
    }
}

export function clear_user_cache() {
    localStorage.remove("logged_user")
}

export async function get_memberships(){

    try{
        const response = await fetch(`${BASE_URL}rooms/`, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json()
        return data.rooms;
    } catch (err){
        throw err;
    }
}