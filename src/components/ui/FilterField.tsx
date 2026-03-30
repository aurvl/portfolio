export type FilterOption = {
  value: string
  label: string
}

type FieldProps = {
  title: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
}

function FilterField({ title, options, value, onChange }: FieldProps) {
  return (
    <div className="flex min-w-0 w-full max-w-full flex-col gap-2 sm:w-auto">
      <p className="text-[var(--text2-col)]">{title}</p>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="
        w-full max-w-full rounded-lg border border-[var(--statboxborder-col)] bg-[var(--fields-bg-col)]
        transition
        focus:ring-2 focus:ring-[var(--accent-lgtblue)]
        focus:border-[var(--accent-lgtblue)]
        hover:bg-[var(--fields-bg-col)]/30
        py-2 px-4
        text-[var(--text2-col)]
        outline-none
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[var(--fields-bg-col)] px-4 py-2 text-[var(--text2-col)]"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FilterField
