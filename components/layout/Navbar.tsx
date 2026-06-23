import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { mainNav } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";
import { getUser } from "@/lib/auth";

export async function Navbar() {
  const user = await getUser();

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        background: "rgba(8,20,40,0.72)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <Container>
        <div className="flex h-[4.25rem] items-center justify-between gap-6">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0"
          >
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold text-white"
              style={{ background: "var(--navy-600)" }}
            >
              SJ
            </span>
            <span
              className="text-[1.0625rem] font-semibold tracking-tight text-white"
            >
              {siteConfig.name}
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-7 md:flex">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth area */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="nav-link hidden text-sm font-medium sm:block"
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
                  className="nav-link hidden text-sm font-medium sm:block"
                >
                  Login
                </Link>
                <Link href="/book" className="btn btn-gold text-sm px-5 py-2.5">
                  Book Appointment
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>

      <style>{`
        .nav-link { color: rgba(240,244,255,0.72); transition: color 0.15s; }
        .nav-link:hover { color: #ffffff; }
      `}</style>
    </header>
  );
}
