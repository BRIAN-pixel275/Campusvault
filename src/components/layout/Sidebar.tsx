
import {
  Home,
  Library,
  BookOpen,
  FileText,
  Bookmark,
  Settings,
  GraduationCap,
} from 'lucide-react'

interface SidebarProps {
  activeNav: string
  setActiveNav: (value: string) => void
  mobileMenu: boolean
  setMobileMenu: (value: boolean) => void
}

const navigation = [
  { name: 'Overview', icon: Home },
  { name: 'My Library', icon: Library },
  { name: 'Student Library', icon: BookOpen },
  { name: 'Course Units', icon: GraduationCap },
  { name: 'Past Papers', icon: FileText },
  { name: 'Bookmarks', icon: Bookmark },
]

function Sidebar({
  activeNav,
  setActiveNav,
  mobileMenu,
  setMobileMenu,
}: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenu && (
        <button
          aria-label="Close navigation menu"
          onClick={() => setMobileMenu(false)}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          mobileMenu
            ? 'flex translate-x-0'
            : 'hidden -translate-x-full'
        } lg:flex lg:translate-x-0 flex-col w-[min(84vw,280px)] lg:w-64 shrink-0
        fixed lg:sticky top-0 left-0 h-screen z-50
        bg-white border-r border-gray-100 px-6 py-7
        transition-transform duration-300`}
      >
        {/* Brand */}
        <div className="mb-12">
          <h1 className="font-heading text-4xl tracking-wide">
            CAMPUS<span className="text-vault-green">VAULT</span>
          </h1>

          <p className="text-[10px] tracking-[0.25em] text-gray-400 mt-1">
            YOUR ACADEMIC WORLD
          </p>
        </div>

        {/* Navigation */}
        <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 mb-5">
          WORKSPACE
        </p>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = activeNav === item.name

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveNav(item.name)
                  setMobileMenu(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                  active
                    ? 'bg-[#EAF5EF] text-vault-green font-semibold'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                }`}
              >
                <Icon size={18} />

                {item.name}

                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-vault-green" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="mt-auto">
          <div className="bg-vault-muted rounded-xl p-4 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap
                size={18}
                className="text-vault-green"
              />

              <span className="text-xs font-semibold">
                Academic space
              </span>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Keep your learning materials organized and accessible.
            </p>
          </div>

          <button className="flex items-center gap-3 text-sm text-gray-500 px-3 py-2">
            <Settings size={18} />
            Settings
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
