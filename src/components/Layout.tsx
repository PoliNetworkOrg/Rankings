import Footer from "./Footer"
import Header from "./Header"

export default function Layout({ children }: { children: React.ReactNode }) {
  // const { isDev } = useRouterContext().context

  return (
    <div className="flex min-h-screen flex-col items-center justify-start font-openSans text-black dark:text-white">
      <Header />
      {children}
      {/* {isDev && <TanStackRouterDevtools />} */}
      <Footer />
    </div>
  )
}
