import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Helper to determine if we're running on Netlify
const isNetlify = () => {
  return window.location.hostname.includes('netlify.app') || import.meta.env.VITE_USE_NETLIFY === 'true';
};

// Helper to transform API paths for Netlify functions if needed
const transformApiPath = (path: string) => {
  if (!isNetlify()) return path;
  
  // If it's already a .netlify/functions path, don't modify it
  if (path.includes('/.netlify/functions/')) return path;
  
  // Transform /api/* paths to /.netlify/functions/api/*
  if (path.startsWith('/api/')) {
    return path.replace('/api/', '/.netlify/functions/api/');
  }
  
  return path;
};

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    try {
      // Try to parse as JSON first
      const data = await res.json();
      console.error("API Error Response:", {
        status: res.status,
        statusText: res.statusText,
        data
      });
      throw new Error(data.message || `${res.status}: ${res.statusText}`);
    } catch (jsonError) {
      // If not JSON, get as text
      const text = await res.text();
      console.error("API Error Response (text):", {
        status: res.status,
        statusText: res.statusText,
        text
      });
      throw new Error(`${res.status}: ${text || res.statusText}`);
    }
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Transform API path for Netlify if needed
  const transformedUrl = transformApiPath(url);
  
  console.log(`API Request: ${method} ${transformedUrl}`, data ? { data } : '');
  
  const options: RequestInit = {
    method,
    headers: data ? { "Content-Type": "application/json" } : undefined,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  };
  
  console.log("Request options:", options);
  
  const res = await fetch(transformedUrl, options);
  
  console.log(`API Response: ${method} ${transformedUrl}`, {
    status: res.status,
    statusText: res.statusText,
    ok: res.ok,
    headers: Object.fromEntries(Array.from(res.headers.entries())),
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Transform API path for Netlify if needed
    const transformedPath = transformApiPath(queryKey[0] as string);
    
    const res = await fetch(transformedPath, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
