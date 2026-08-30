import Link from 'next/link';
export function Header(){return <header className="container nav"><Link href="/" className="logo"><span className="coin">¢</span>My Two Cents</Link><nav className="navlinks"><Link href="/search">Explore</Link><Link href="/business/claim">For Business Owners</Link><Link href="/login">Log in</Link><Link href="/signup" className="btn">Join the community</Link></nav></header>}
export function Footer(){return <footer className="container"><span>© 2026 My Two Cents. Real opinions, better choices.</span><span>Community guidelines · Privacy · Terms</span></footer>}
export function MobileNav(){return <nav className="mobile-nav"><Link href="/"><b>⌂</b>Home</Link><Link href="/search"><b>⌕</b>Explore</Link><Link href="/login"><b>◉</b>Profile</Link></nav>}
export function Shell({children}:{children:React.ReactNode}){return <><Header/>{children}<Footer/><MobileNav/></>}
