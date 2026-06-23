import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile" };

const profile = {
  firstName: "Sarah",
  lastName: "O'Brien",
  email: "sarah.obrien@email.com",
  phone: "+353 87 123 4567",
  dob: "1990-03-14",
  nationality: "Irish",
  address: "12 Grafton Street, Dublin 2",
  passportNo: "P1234567",
  passportExpiry: "2030-06-01",
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
      <span className="w-40 shrink-0 text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900">{value}</span>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Avatar + name */}
      <div className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-2xl font-bold text-white">
          {profile.firstName[0]}
          {profile.lastName[0]}
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-sm text-slate-500">{profile.email}</p>
        </div>
        <button
          type="button"
          className="ml-auto rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Edit profile
        </button>
      </div>

      {/* Personal details */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Personal details
        </h3>
        <div className="space-y-4 divide-y divide-slate-100">
          <InfoRow label="First name" value={profile.firstName} />
          <div className="pt-4">
            <InfoRow label="Last name" value={profile.lastName} />
          </div>
          <div className="pt-4">
            <InfoRow label="Date of birth" value={profile.dob} />
          </div>
          <div className="pt-4">
            <InfoRow label="Nationality" value={profile.nationality} />
          </div>
          <div className="pt-4">
            <InfoRow label="Address" value={profile.address} />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Contact information
        </h3>
        <div className="space-y-4 divide-y divide-slate-100">
          <InfoRow label="Email" value={profile.email} />
          <div className="pt-4">
            <InfoRow label="Phone" value={profile.phone} />
          </div>
        </div>
      </div>

      {/* Passport */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Passport
        </h3>
        <div className="space-y-4 divide-y divide-slate-100">
          <InfoRow label="Passport number" value={profile.passportNo} />
          <div className="pt-4">
            <InfoRow label="Expiry date" value={profile.passportExpiry} />
          </div>
        </div>
      </div>
    </div>
  );
}
