export const authUtils = {
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  removeToken: (): void => {
    localStorage.removeItem('token');
  },

  logout: (): void => {
    authUtils.removeToken();
    window.location.href = '/login';
    window.dispatchEvent(new CustomEvent('auth:logout'));
  },

  isTokenExpired: (response: Response): boolean => {
    return response.status === 401 || response.status === 403;
  },
};
