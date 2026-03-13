import { useCurrentUser, useTripHistory } from "@/hooks/use-api";
import TicketPurchaseSection from "@/components/TicketPurchaseSection";

const MyTripsSection = () => {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: trips, isLoading: tripsLoading } = useTripHistory(user ?? null);

  const totalSpent = (trips ?? []).reduce((sum, trip) => sum + (trip.fare_cents ?? 0), 0);

  if (userLoading) {
    return (
      <section className="bg-background py-10">
        <div className="max-w-[1080px] mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">Tickets</h2>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="bg-background py-10">
        <div className="max-w-[1080px] mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-3">Tickets</h2>
          <p className="text-muted-foreground">Sign in to view your tickets and trip history.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-10">
      <div className="max-w-[1080px] mx-auto px-4">
        <TicketPurchaseSection />
        <h2 className="text-2xl font-bold text-foreground mb-2 mt-12">My Trips</h2>
        <p className="text-sm text-muted-foreground mb-6">Trip inventory and profile overview.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border border-border rounded-sm p-4 bg-card">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Student</p>
            <p className="text-sm font-semibold text-foreground">{user.full_name ?? "UofT Student"}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground mt-1">Student ID: {user.student_id ?? "Not linked"}</p>
          </div>

          <div className="border border-border rounded-sm p-4 bg-card">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Purchased trips</p>
            <p className="text-2xl font-bold text-foreground">{trips?.length ?? 0}</p>
          </div>

          <div className="border border-border rounded-sm p-4 bg-card">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Total spend</p>
            <p className="text-2xl font-bold text-foreground">${(totalSpent / 100).toFixed(2)}</p>
          </div>
        </div>

        {tripsLoading ? (
          <p className="text-muted-foreground">Loading trips...</p>
        ) : trips?.length === 0 ? (
          <p className="text-muted-foreground">No purchased trips yet.</p>
        ) : (
          <ul className="space-y-3">
            {trips?.map((trip) => (
              <li
                key={trip.id}
                className="border border-border rounded-sm p-4 bg-card"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-foreground">Route {trip.route_id}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(trip.started_at).toLocaleString()} · {trip.status}
                    </p>
                  </div>
                  {trip.fare_cents != null && (
                    <span className="text-sm font-medium">${(trip.fare_cents / 100).toFixed(2)}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default MyTripsSection;
