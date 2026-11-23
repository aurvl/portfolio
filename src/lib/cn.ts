// Assemble des noms de classes : ignore les valeurs vides (false, null, undefined).
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}
