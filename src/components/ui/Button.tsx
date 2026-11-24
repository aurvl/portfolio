// Boutons du design v3 : primaire (bleu plein), secondaire (bleu clair), contour, pilule (action flottante).
// Rend un <a> si `href` est fourni, sinon un <button>. Utilisé sur toutes les sections.
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

// Variantes éditoriales (design/BRIEF.md §2) : `solid` = bouton plein rectangulaire (un seul par écran),
// `line` = simple filet, `link` = texte souligné avec flèche. Les autres variantes sont l'ancien style,
// toujours utilisé par le bouton « En savoir plus » de la landing.
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'pill' | 'solid' | 'line' | 'link'

type CommonProps = {
  variant?: ButtonVariant
  icon?: ReactNode
  children: ReactNode
  className?: string
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined }

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string }

type ButtonProps = ButtonAsButton | ButtonAsLink

function Button(props: ButtonProps) {
  const { variant = 'primary', icon, children, className, ...rest } = props
  const classes = cn('btn', `btn--${variant}`, className)
  const content = (
    <>
      {children}
      {icon ? <span className="btn__icon" aria-hidden="true">{icon}</span> : null}
    </>
  )

  if ('href' in rest && rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  )
}

export default Button
