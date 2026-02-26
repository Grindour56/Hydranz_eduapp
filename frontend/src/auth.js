// simple authentication utility using sessionStorage (clears when browser/tab closed)
const STORAGE_KEY = 'hydranz_user';

export function loginUser(email) {
  const user = { email, loggedInAt: Date.now() };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function logoutUser() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function getCurrentUser() {
  const val = sessionStorage.getItem(STORAGE_KEY);
  return val ? JSON.parse(val) : null;
}

export function isAuthenticated() {
  return getCurrentUser() !== null;
}
