import { Link as RouterLink, LinkProps } from "react-router-dom"
import { LINKS } from "../utils/constants"

function Link({ className = "", ...props }: LinkProps) {
  return (
    <li className="flex flex-1 justify-center">
      <RouterLink
        {...props}
        className={
          "underline underline-offset-2 transition-colors hover:text-blue-600 dark:hover:text-blue-400" +
          className
        }
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
    <li className="flex flex-1 justify-center">
      <a
        {...props}
        target={target}
        rel={rel}
        className={
          "underline underline-offset-2 transition-colors hover:text-blue-600 dark:hover:text-blue-400" +
          className
        }
      />
    </li>
  )
}
export default function Footer() {
  return (
    <footer className="flex w-full items-center justify-center border-t border-slate-800/20 dark:border-slate-300/20">
      <nav className="mx-auto flex max-w-4xl flex-1 items-center justify-between px-2 py-4 max-md:flex-col">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <ExternalLink href={LINKS.githubSource}>Source</ExternalLink>
        <Link to="/privacy">Privacy & Cookies</Link>
      </nav>
    </footer>
  )
}
