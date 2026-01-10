const API_URL=process.env.NEXT_PUBLIC_API_URL
export async function apiFetch(url:string,options:RequestInit={}) {
    const res=await fetch(`${API_URL}${url}`, {
        ...options,
        credentials:"include",
        headers:{
            "Content-Type":"application/json",
            ...(options.headers || {})
        }
    })
    if(!res.ok){
        const error=await res.json();
        throw new Error(error.message || "Something went wrong")
    }
    return res.json();
}