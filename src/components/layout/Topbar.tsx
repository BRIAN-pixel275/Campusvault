
import {
  Search,
  Bell,
  Menu,
  X,
} from 'lucide-react'

interface TopbarProps {
  activeNav: string
  search: string
  setSearch: (value: string) => void
  mobileMenu: boolean
  setMobileMenu: (value: boolean) => void
}

function Topbar({
  activeNav,
  search,
  setSearch,
  mobileMenu,
  setMobileMenu,
}: TopbarProps) {
  return (
    <>
      {/* MOBILE HEADER */}
      <header className="lg:hidden flex items-center justify-between border-b border-gray-100 px-5 py-4 -mx-5 -mt-7 mb-7">
        <h1 className="font-heading text-3xl">
          CAMPUS<span className="text-vault-green">VAULT</span>
        </h1>

        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label={mobileMenu ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenu}
        >
          {mobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* DESKTOP AND TABLET TOPBAR */}
      <div className="flex items-center justify-between gap-4 mb-12">
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
          Workspace
          <span>/</span>
          <span className="text-black font-medium">
            {activeNav}
          </span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <div className="relative hidden md:block">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources..."
              className="bg-gray-50 border border-gray-100 rounded-full pl-10 pr-4 py-2.5 text-xs w-64 outline-none focus:border-vault-green"
            />
          </div>

          <button
            aria-label="Notifications"
            className="relative p-2.5 rounded-full border border-gray-100 hover:bg-gray-50"
          >
            <Bell size={18} />

            <span className="absolute top-2 right-2 w-2 h-2 bg-vault-green rounded-full" />
          </button>

          <div
            className="w-9 h-9 rounded-full bg-[#EAF5EF] flex items-center justify-center text-vault-green text-sm font-bold"
            aria-label="User profile"
          >
            B
          </div>
        </div>
      </div>
    </>
  )
}

export default Topbar
