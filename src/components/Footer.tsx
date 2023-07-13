import { Link as RouterLink, LinkPropsOptions } from "@tanstack/router"
import { LINKS } from "@/utils/constants"

function Link(props: LinkPropsOptions & { children: React.ReactNode }) {
  return (
    <li className="flex justify-center">
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
    <li className="flex justify-center">
      <a
        {...props}
        target={target}
        rel={rel}
        className={
          "text-black underline underline-offset-2 dark:text-white" + className
        }
      />
    </li>
  )
}
export default function Footer() {
  return (
    <footer className="flex w-full items-center justify-center border-t border-slate-800/20 dark:border-slate-300/20">
      <nav className="mx-auto flex max-w-7xl flex-1 items-center justify-between p-4 max-md:flex-col">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <ExternalLink href={LINKS.githubSource}>Source</ExternalLink>
        <Link to="/privacy">Privacy & Cookies</Link>
        <ExternalLink href={LINKS.polinetworkMain}>
          Made by PoliNetwork
        </ExternalLink>
      </nav>
    </footer>
  )
}
