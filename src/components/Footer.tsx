import { Link as RouterLink, LinkPropsOptions } from "@tanstack/router"
import { LINKS } from "@/utils/constants"
import { cn } from "@/utils/ui"

function Link({
  className,
  ...props
}: LinkPropsOptions & { children: React.ReactNode; className?: string }) {
  return (
    <li className={cn("flex justify-center", className)}>
      <RouterLink
        {...props}
        className="text-black underline underline-offset-2 dark:text-white"
      />
    </li>
  )
}

function ExternalLink({
  className = "",
  target = "_blank",
  rel = "noreferrer noopener",
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <li className={cn("flex justify-center", className)}>
      <a
        {...props}
        target={target}
        rel={rel}
        className={"text-black underline underline-offset-2 dark:text-white"}
      />
    </li>
  )
}
export default function Footer() {
  return (
    <footer className="flex w-full items-center justify-center border-t border-slate-800/20 dark:border-slate-300/20">
      <nav className="mx-auto flex max-w-7xl flex-1 items-center justify-between p-4 max-md:flex-col">
        <ExternalLink href={LINKS.githubSource} className="max-md:order-3">
          Source
        </ExternalLink>
        <Link to="/about" className="max-md:order-2">
          About
        </Link>
        <Link to="/" className="max-md:order-1">
          Home
        </Link>
        <Link to="/privacy" className="max-md:order-5">
          Privacy & Cookies
        </Link>
        <ExternalLink className="max-md:order-4" href={LINKS.polinetworkMain}>
          PoliNetwork
        </ExternalLink>
      </nav>
    </footer>
  )
}
