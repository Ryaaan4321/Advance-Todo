const API_URL = process.env.NEXT_PUBLIC_API_URL
export async function apiFetch(
    url: string,
    options: RequestInit = {},
    accessToken?: string
) {
    const res = await fetch(`${API_URL }${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(accessToken && {
                Authorization: `Bearer ${accessToken}`,
            }),
            ...options.headers,
        },
        credentials: "include", 
    })
    if (res.status === 401) {
        throw new Error("UNAUTHORIZED")
    }
    if (!res.ok) {
        const err = await res.json()
        throw err
    }
    return res.json()
}
