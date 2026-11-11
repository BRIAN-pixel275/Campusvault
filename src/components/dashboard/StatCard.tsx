
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
}

function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="border border-gray-100 rounded-xl p-5 hover:border-[#A8D7BD] transition">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[9px] font-bold tracking-widest text-gray-400">
          {label}
        </p>

        <Icon size={17} className="text-vault-green" />
      </div>

      <p className="font-heading text-5xl">{value}</p>
    </div>
  )
}

export default StatCard
