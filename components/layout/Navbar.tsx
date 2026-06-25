import Link from "next/link";
import { LogoImage } from "@/components/ui/LogoImage";
import { Container } from "@/components/ui/Container";
import { mainNav } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";
import { getUser } from "@/lib/auth";
import { NavbarScrollEffect } from "@/components/layout/NavbarScrollEffect";
import { MobileMenu } from "@/components/layout/MobileMenu";

export async function Navbar() {
  const user = await getUser();

  return (
    <header
      data-navbar
      className="glass-navbar sticky top-0 z-40"
      style={{
        transition: "background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
      }}
    >
      <NavbarScrollEffect />
      <Container>
        <div className="flex h-[4.25rem] items-center justify-between gap-6">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0"
          >
            <LogoImage size={36} />
            <span className="text-[1.0625rem] font-semibold tracking-tight text-white">
              {siteConfig.name}
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-7 md:flex">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link-underline text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth area — desktop / tablet */}
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="nav-link-underline text-sm font-medium"
                >
                  Dashboard
                </Link>
                <form action="/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="btn btn-outline-white text-sm px-4 py-2"
                  >
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="nav-link-underline text-sm font-medium"
                >
                  Login
                </Link>
                <Link href="/book" className="btn btn-gold text-sm px-5 py-2.5">
                  Book Appointment
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <MobileMenu nav={mainNav} isAuthenticated={!!user} />
        </div>
      </Container>

    </header>
  );
}
