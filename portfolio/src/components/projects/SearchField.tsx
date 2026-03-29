import { FiSearch } from 'react-icons/fi'

type SearchFieldProps = {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}

function SearchField({ label, placeholder, value, onChange }: SearchFieldProps) {
  return (
    <div className="flex w-full flex-col gap-2 md:w-2/5">
      <p className="text-[var(--text2-col)]">{label}</p>

      <div
        className="
        relative rounded-lg border border-[var(--statboxborder-col)] bg-[var(--fields-bg-col)]
        transition
        focus-within:ring-2 focus-within:ring-[var(--accent-lgtblue)]
        focus-within:border-[var(--accent-lgtblue)]
        "
      >
        <FiSearch
          size={22}
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text2-col)]"
        />

        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="
            w-full rounded-lg bg-transparent py-3 pl-14 pr-4
            text-[var(--text2-col)] placeholder:text-[var(--text2-col)]
            outline-none
          "
        />
      </div>
    </div>
  )
}

export default SearchField
