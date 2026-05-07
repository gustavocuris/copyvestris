interface Props {
  openForm: () => void
}

const Navbar = ({ openForm }: Props) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">VESTRIS</div>
      <button className="navbar-cta" onClick={openForm}>
        Garantir Acesso
      </button>
    </nav>
  )
}

export default Navbar
