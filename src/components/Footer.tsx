import { type LinkPropsOptions, Link as RouterLink } from "@tanstack/router"
import type { HTMLAttributes } from "react"
import { LINKS } from "@/utils/constants"
import { cn } from "@/utils/ui"

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/20 dark:border-slate-300/30">
      <div
        id="footer-container"
        className="mx-auto flex max-w-7xl items-start justify-between gap-8 p-4 max-md:flex-col max-md:gap-4"
      >
        <FooterColumn className="max-md:order-2">
          <p>
            Made by{"  "}
            <ExternalLink href={LINKS.polinetworkMain}>
              PoliNetwork
            </ExternalLink>
          </p>
          <p className="text-xs text-slate-400">
            L'accuratezza o l'affidabilità dei contenuti di questo sito non è
            garantita. <br /> Consulta il sito ufficiale del{" "}
            <ExternalLink href="https://polimi.it">
              Politecnico di Milano
            </ExternalLink>{" "}
            per controllare la tua posizione in graduatoria per immatricolarti.
          </p>
        </FooterColumn>

        <FooterColumn className="shrink-0">
          <nav className="flex justify-end gap-8 max-md:justify-center">
            <Link to="/about">About</Link>
            <Link to="/source">Source</Link>
            <Link to="/privacy">Privacy & Cookies</Link>
          </nav>
        </FooterColumn>
      </div>
    </footer>
  )
}

function FooterColumn({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-2 max-md:w-full", className)}
      {...props}
    />
  )
}

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
      className={`text-black underline underline-offset-2 dark:text-inherit${className}`}
    >
      {children}
    </a>
  )
}
