(function() {
"use strict";

const STORAGE_KEY = "caSlidesLastOffline";
const PING_INTERVAL = 15_000;
const createIndicator = () => {
  const span = document.createElement("span");
  span.className = "notes-offline-indicator";
  span.setAttribute("aria-hidden", "true");
  span.textContent = "offline";
  return span;
};

const safeStorage = () => {
  try {
    if (typeof window.localStorage === "object") return window.localStorage;
  } catch (error) {
    if (typeof DOMException !== "undefined" && error instanceof DOMException) return null;
  }
  return null;
};

const updateStorage = isOffline => {
  const storage = safeStorage();
  if (!storage) return;
  if (isOffline) storage.setItem(STORAGE_KEY, Date.now().toString());
  else storage.removeItem(STORAGE_KEY);
};

const storedOfflineTimestamp = () => {
  const storage = safeStorage();
  if (!storage) return NaN;
  const value = storage.getItem(STORAGE_KEY);
  return value ? Number(value) : NaN;
};

const isOfflineHinted = () => !Number.isNaN(storedOfflineTimestamp());

const applyOfflineClass = isOffline => {
  document.body.classList.toggle("offline", isOffline);
};

const isServerReachable = async () => {
  // Avoid CORS/security errors when opened directly via file://
  const protocol = (window.location && window.location.protocol) || "";
  if (protocol === "file:") return true;
  if (typeof fetch !== "function") return isOfflineHinted();
  try {
    const response = await fetch(window.location.href, {
      method: "HEAD",
      cache: "no-store",
      credentials: "same-origin",
      keepalive: true
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

const updateOfflineState = async () => {
  const supportsOnline = typeof navigator.onLine === "boolean";
  const reachable = await isServerReachable();
  const offlineHint = isOfflineHinted();
  const isOffline = supportsOnline
    ? (!navigator.onLine || !reachable)
    : (offlineHint || !reachable);
  applyOfflineClass(isOffline);
  updateStorage(isOffline);
};

const activateIndicator = () => {
  const notes = Array.from(document.querySelectorAll(".notes"));
  if (notes.length === 0) return;
  notes.forEach(note => {
    if (note.querySelector(".notes-offline-indicator")) return;
    note.prepend(createIndicator());
  });

  window.addEventListener("online", updateOfflineState);
  window.addEventListener("offline", updateOfflineState);
  updateOfflineState();
  const poll = () => {
    updateOfflineState().finally(() => {
      setTimeout(poll, PING_INTERVAL);
    });
  };
  setTimeout(poll, PING_INTERVAL);
};

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", activateIndicator);
else
  activateIndicator();

})();
