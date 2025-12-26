export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';
const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

const setCookie = (name: string, value: string, maxAge: number) => {
  if (!isBrowser()) return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
};

const removeCookie = (name: string) => {
  if (!isBrowser()) return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
};

export const authService = {
  // Store tokens in sessionStorage
  setTokens(tokens: AuthTokens) {
    if (isBrowser()) {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
      sessionStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
      setCookie(ACCESS_TOKEN_KEY, tokens.accessToken, ACCESS_TOKEN_MAX_AGE);
      setCookie(REFRESH_TOKEN_KEY, tokens.refreshToken, REFRESH_TOKEN_MAX_AGE);
    }
  },

  // Get access token
  getAccessToken(): string | null {
    if (isBrowser()) {
      return sessionStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return null;
  },

  // Get refresh token
  getRefreshToken(): string | null {
    if (isBrowser()) {
      return sessionStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  },

  // Store user data
  setUser(user: User) {
    if (isBrowser()) {
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  // Get user data
  getUser(): User | null {
    if (isBrowser()) {
      const userStr = sessionStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  // Clear all auth data
  clearAuth() {
    if (isBrowser()) {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      removeCookie(ACCESS_TOKEN_KEY);
      removeCookie(REFRESH_TOKEN_KEY);
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },

  // Login
  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Login failed' };
      }

      this.setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      this.setUser(data.user);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred during login' };
    }
  },

  // Refresh access token
  async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        this.clearAuth();
        return false;
      }

      this.setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      return true;
    } catch (error) {
      this.clearAuth();
      return false;
    }
  },

  // Logout
  logout() {
    this.clearAuth();
    if (isBrowser()) {
      window.location.href = '/auth/signin';
    }
  },
};
