import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-4 py-6 text-sm text-neutral-600">
        <p>&copy; {new Date().getFullYear()} Diadem &amp; Co.</p>
        <div className="flex gap-4">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-conditions">Terms &amp; Conditions</Link>
        </div>
      </div>
    </footer>
  )
}
