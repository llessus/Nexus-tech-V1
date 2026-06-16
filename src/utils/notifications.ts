// Sistema de notificações via localStorage

export interface Notification {
  id: string;
  type: 'message' | 'payment' | 'system' | 'hire';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

const STORAGE_KEY = 'nexus_notifications';

export function getNotifications(): Notification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Notification[];
  } catch {
    return [];
  }
}

export function addNotification(n: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
  const list = getNotifications();
  const newNotif: Notification = {
    ...n,
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    read: false,
  };
  list.unshift(newNotif);
  // Manter no máximo 30 notificações
  if (list.length > 30) list.splice(30);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function markAllAsRead(): void {
  const list = getNotifications();
  list.forEach(n => (n.read = true));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getUnreadCount(): number {
  return getNotifications().filter(n => !n.read).length;
}

export function clearNotifications(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Agora';
  if (minutes < 60) return `Há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Há ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Ontem';
  return `Há ${days} dias`;
}
