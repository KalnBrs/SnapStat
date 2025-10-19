function Button({ label, onClick, isActive, width=420, margin=5 }) {
  const buttonClass = isActive ? 'active' : '';
  return (
    <button style={{width: width, marginTop: margin}} className={`${buttonClass} mx-1 font-bold`} onClick={onClick}>
      {label}
    </button>
  )
}

export default Button