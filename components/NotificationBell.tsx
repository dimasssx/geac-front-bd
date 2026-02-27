"use client";

import { useState, useEffect, useRef } from "react";
import {
  getUnreadCount,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  NotificationResponseDTO,
} from "@/app/actions/notificationActions";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationResponseDTO[]>(
    [],
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora (mesma lógica usada no perfil do Navbar)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Carrega a quantidade inicial
  useEffect(() => {
    getUnreadCount().then(setCount);
  }, []);

  // Quando abre o dropdown, busca os detalhes das notificações
  const toggleDropdown = async () => {
    if (!isOpen) {
      const data = await getUnreadNotifications();
      setNotifications(data);
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (id: number) => {
    await markAsRead(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setNotifications([]);
    setCount(0);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-zinc-600 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <span className="text-xl">🔔</span>
        {count > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
            {count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Notificações
            </h3>
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-zinc-500">
                Nenhuma notificação nova.
              </p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 flex justify-between items-start gap-2"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {notif.title}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {notif.message}
                    </p>
                  </div>
                  <button
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="text-zinc-400 hover:text-green-500"
                    title="Marcar como lido"
                  >
                    ✓
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
