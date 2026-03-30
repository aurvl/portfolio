type StatBoxProps = {
  icon: React.ReactNode
  text: string
}

function StatBox({ icon, text }: StatBoxProps) {
  return (
    <div className="stat-box">
      <div className="stat-box__icon">{icon}</div>
      <p className="text-[var(--text2-col)]">{text}</p>
    </div>
  )
}

export default StatBox