import Navbar from '@/components/Navabar'

export default function BoardsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <header className="flex justify-end items-center p-4 gap-4 h-16">
        <Navbar />
      </header>
      {children}
    </>
  )
} 