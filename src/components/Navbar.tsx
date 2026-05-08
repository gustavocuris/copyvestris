interface Props {
  openForm: () => void
}

const Navbar = ({ openForm }: Props) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img
          src="/animals/LOGOS%20VESTRIS%202026%20(3).png"
          alt="VESTRIS"
          className="navbar-logo-img"
        />
      </div>
      <button className="navbar-cta" onClick={openForm}>
        Garantir Acesso
      </button>
    </nav>
  )
}

export default Navbar
