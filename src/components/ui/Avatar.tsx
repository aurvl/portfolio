// Avatar rond : photo du profil, ou disque gris tant qu'il n'y a pas d'image.
// Apparaît en haut à gauche de la section About (design/screens/02-about.png).
import { cn } from '../../lib/cn'

type AvatarProps = {
  src: string | null
  alt: string
  className?: string
}

function Avatar({ src, alt, className }: AvatarProps) {
  return (
    <div
      className={cn('avatar', className)}
      role={src ? undefined : 'img'}
      aria-label={src ? undefined : alt}
    >
      {src ? (
        <img
          className="avatar__image"
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
        />
      ) : null}
    </div>
  )
}

export default Avatar
