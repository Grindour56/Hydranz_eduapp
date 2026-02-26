// simple authentication utility using localStorage
const STORAGE_KEY = 'hydranz_user';

export function loginUser(email) {
  const user = { email, loggedInAt: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function logoutUser() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentUser() {
  const val = localStorage.getItem(STORAGE_KEY);
  return val ? JSON.parse(val) : null;
}

export function isAuthenticated() {
  return getCurrentUser() !== null;
}
