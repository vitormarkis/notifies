import * as Popover from "@radix-ui/react-popover"
import twc from "tailwindcss/colors"
import ReactDOM from "react-dom"
import { useEffect, useState } from "react"
import {
  INotification,
  notificationSchema,
  notificationSessionSchema,
} from "../schemas/notifications"
import { socket } from "../App"
import { useNotificationStore } from "../zustand/notifications"
import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "../zustand/auth"
import axios, { AxiosHeaders } from "axios"
import { queryClient } from "../services/queryClient"
import { z } from "zod"
import { Notification } from "./Notification"

export function NotificationsPopover({
  children,
}: {
  children: React.ReactNode
}) {
  const { token, isAuth, user } = useAuthStore(state => state)
  const headers = new AxiosHeaders().setAuthorization(`bearer ${token}`)

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", user?.username ?? null],
    queryFn: () =>
      axios
        .get("http://localhost:3939/user/notifications", { headers })
        .then(r => z.array(notificationSessionSchema).parse(r.data)),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: isAuth,
  })

  useEffect(() => {
    const socketListeners = ["post_shutdown", "bid_was_made"]
    socketListeners.forEach(listener => {
      socket.on(listener, (notification: INotification) => {
        Promise.all([
          queryClient.invalidateQueries(["notifications",
            user?.username ?? null,
          ]),
          queryClient.invalidateQueries(["posts", user?.username ?? null]),
        ])
      })
    })
  }, [socket])

  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      {ReactDOM.createPortal(
        <Popover.Content align="end">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 text-white shadow-lg shadow-black/20 max-h-[75vh] overflow-y-scroll scroll-thin text-sm">
            {notifications && notifications.length > 0 ? (
              notifications.map(not => (
                <Notification key={not.id} notification={not} />
              ))
            ) : (
              <div className="hover:bg-zinc-700/10 px-24 py-2 text-zinc-500">
                Sem notificações
              </div>
            )}
          </div>
          <Popover.Arrow fill={twc.zinc[800]} />
        </Popover.Content>,
        document.querySelector("#portal")!
      )}
    </Popover.Root>
  )
}
