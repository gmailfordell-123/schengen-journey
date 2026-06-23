/**
 * Static data for the booking / "Plan your journey" selection flow.
 * Pure data + lookup helpers — no backend.
 *
 * Origins (UK / Ireland) are the non-Schengen *applying* locations. Each origin
 * maps to its supported visa-application centres, and to the Schengen
 * destination countries we support for applicants from that location.
 *
 * No emoji are used here — country visuals are handled by the UI layer.
 */

export type OriginId = "uk" | "ireland";

export type Origin = {
  id: OriginId;
  name: string;
  description: string;
};

export type City = {
  id: string;
  name: string;
};

export type Destination = {
  id: string;
  name: string;
};

export const origins: Origin[] = [
  {
    id: "uk",
    name: "United Kingdom",
    description: "Apply through London, Birmingham, Manchester or Edinburgh.",
  },
  {
    id: "ireland",
    name: "Ireland",
    description: "Apply through our supported Dublin centre.",
  },
];

/** Supported visa-application centres for each applying location. */
export const citiesByOrigin: Record<OriginId, City[]> = {
  uk: [
    { id: "london", name: "London" },
    { id: "birmingham", name: "Birmingham" },
    { id: "manchester", name: "Manchester" },
    { id: "edinburgh", name: "Edinburgh" },
  ],
  ireland: [{ id: "dublin", name: "Dublin" }],
};

// Schengen country reference pool.
const C: Record<string, Destination> = {
  fr: { id: "fr", name: "France" },
  de: { id: "de", name: "Germany" },
  es: { id: "es", name: "Spain" },
  it: { id: "it", name: "Italy" },
  nl: { id: "nl", name: "Netherlands" },
  pt: { id: "pt", name: "Portugal" },
  gr: { id: "gr", name: "Greece" },
  at: { id: "at", name: "Austria" },
  be: { id: "be", name: "Belgium" },
  ch: { id: "ch", name: "Switzerland" },
  cz: { id: "cz", name: "Czechia" },
  pl: { id: "pl", name: "Poland" },
  is: { id: "is", name: "Iceland" },
  hu: { id: "hu", name: "Hungary" },
  dk: { id: "dk", name: "Denmark" },
  fi: { id: "fi", name: "Finland" },
  hr: { id: "hr", name: "Croatia" },
  si: { id: "si", name: "Slovenia" },
  no: { id: "no", name: "Norway" },
  se: { id: "se", name: "Sweden" },
};

/**
 * Destination Schengen countries we support, by applying location.
 * These are the canonical lists shown in the booking flow.
 */
export const destinationsByOrigin: Record<OriginId, Destination[]> = {
  uk: [C.fr, C.nl, C.it, C.gr, C.hu, C.at, C.ch, C.dk, C.is, C.fi],
  ireland: [
    C.nl, C.at, C.it, C.ch, C.be, C.hr, C.dk, C.hu, C.fi, C.si, C.no, C.se, C.is,
  ],
};

/** Legacy city-based destinations used by the /plan exploration flow. */
export const destinationsByCity: Record<string, Destination[]> = {
  london: [C.fr, C.de, C.es, C.it, C.nl, C.pt, C.gr, C.ch, C.at, C.be, C.cz, C.pl],
  manchester: [C.es, C.it, C.fr, C.de, C.nl, C.pt, C.gr, C.pl],
  birmingham: [C.fr, C.de, C.es, C.it, C.nl, C.pt],
  edinburgh: [C.fr, C.de, C.nl, C.es, C.it, C.is, C.pl],
  dublin: [C.fr, C.es, C.it, C.de, C.nl, C.pt, C.pl, C.at],
};

export function getOrigin(id: OriginId | null): Origin | undefined {
  return origins.find((o) => o.id === id);
}

export function getCity(originId: OriginId | null, cityId: string | null) {
  if (!originId || !cityId) return undefined;
  return citiesByOrigin[originId].find((c) => c.id === cityId);
}

export function getDestination(originId: OriginId | null, destId: string | null) {
  if (!originId || !destId) return undefined;
  return destinationsByOrigin[originId].find((d) => d.id === destId);
}
