
import { ArrowUpRight } from 'lucide-react'

interface PlaceholderPageProps {
  title: string
  description: string
}

function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="py-16 sm:py-24">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-7 h-px bg-vault-green" />
        <p className="text-[10px] font-bold tracking-[0.25em] text-vault-green uppercase">
          CampusVault workspace
        </p>
      </div>

      <h2 className="font-heading text-6xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-tight">
        {title.toUpperCase()}
      </h2>

      <p className="text-sm text-gray-500 mt-5 max-w-md leading-relaxed">
        {description}
      </p>

      <div className="mt-10 border border-gray-100 rounded-2xl p-7 sm:p-10 bg-[#F8FAF8]">
        <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center mb-5">
          <ArrowUpRight size={22} className="text-vault-green" />
        </div>

        <h3 className="font-heading text-2xl mb-2">
          SOMETHING GOOD IS TAKING SHAPE.
        </h3>

        <p className="text-xs text-gray-400">
          This section is under development. Check back as CampusVault grows.
        </p>
      </div>
    </section>
  )
}

export default PlaceholderPage
