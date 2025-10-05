"use client"
import AppStateProvider from "@/context/AppStateContext"
import Sidebar from "@/components/Sidebar"
import Topbar from "@/components/Topbar"
import styles from "./dashboard-layout.module.css"
import { SessionProvider } from 'next-auth/react'

export default function DashboardLayout({ children, session }) {
  return (
    <AppStateProvider>
      <SessionProvider session={session}>
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.main}>
          {/* <Topbar /> */}
          <div className={styles.content}>{children}</div>
          </div>
        </div>
      </SessionProvider>
    </AppStateProvider>
  )
}
