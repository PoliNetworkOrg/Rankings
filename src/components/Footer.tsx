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
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      target={target}
      rel={rel}
      className={
        "text-black underline underline-offset-2 dark:text-inherit" + className
      }
    >
      {children}
    </a>
  )
}
export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/20 py-4 text-sm dark:border-slate-300/20">
      <div className="mx-auto px-4 w-full max-w-7xl items-start justify-between gap-8 px-4">
        <div className="mx-auto flex w-full max-w-7xl items-start justify-between gap-8 max-md:flex-col-reverse max-md:gap-4">
          <p>
            Made by{"  "}
            <ExternalLink href={LINKS.polinetworkMain}>
              PoliNetwork
            </ExternalLink>
          </p>

          <nav className="flex flex-shrink-0 justify-end gap-8">
            <Link to="/about">About</Link>
            <ExternalLink href={LINKS.githubSource}>Source</ExternalLink>
            <Link to="/privacy">Privacy & Cookies</Link>
          </nav>
        </div>
        <p className="max-w-8xl mt-2 flex-1 text-xs text-slate-400">
          L'accuratezza o l'affidabilità dei contenuti di questo sito non è
          garantita. <br /> Consulta il sito ufficiale del{" "}
          <ExternalLink href="https://polimi.it">
            Politecnico di Milano
          </ExternalLink>{" "}
          per controllare la tua posizione in graduatoria per immatricolarti.
        </p>
      </div>
    </footer>
  )
}
