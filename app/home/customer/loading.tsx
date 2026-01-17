export default function Loading() {
  return (
    <main className="min-h-dvh bg-background flex flex-col items-center justify-center">
      <img src="/images/unknown.jpg" alt="QuickBite" className="w-32 h-32 mb-4" />
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </main>
  )
}
