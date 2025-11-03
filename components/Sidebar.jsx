"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Link2, FileText, CheckSquare, Activity, Settings, LogOut } from "lucide-react"
import styles from "./Sidebar.module.css"
import { useSession, signOut } from "next-auth/react"

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/integrations", label: "Integraciones", icon: Settings },
  { href: "/connections", label: "Conexiones", icon: Link2 },
  //{ href: "/templates", label: "Plantillas", icon: FileText },
  //{ href: "/review", label: "Revisión", icon: CheckSquare },
  //{ href: "/activity", label: "Actividad", icon: Activity },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: "/ingresar" })
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1>Infera</h1>
      </div>
      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className={`${styles.navItem} ${isActive ? styles.active : ""}`}>
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className={styles.footer}>
        <p className={styles.user}>{session?.user?.email}</p>
      </div>
        <button type="button" className={styles.signOutButton} onClick={handleSignOut}>
          <LogOut size={18} />
          <span>Salir</span>
        </button>
    </aside>
  )
}
