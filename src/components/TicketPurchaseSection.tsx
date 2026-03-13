import { useCurrentUser, useMyTickets, usePurchaseTicket } from "@/hooks/use-api";
import type { TicketType } from "@/lib/api";

const TICKET_OPTIONS: { type: TicketType; label: string; description: string }[] = [
  { type: "SHUTTLE_SINGLE", label: "Single ride", description: "Valid for 2 hours" },
  { type: "SHUTTLE_DAY", label: "Day pass", description: "Valid for 24 hours" },
  { type: "GUEST", label: "Guest ticket", description: "Valid for 7 days" },
];

const TicketPurchaseSection = () => {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: tickets, isLoading: ticketsLoading } = useMyTickets(user ?? null);
  const purchaseTicket = usePurchaseTicket();

  if (userLoading) {
    return (
      <section className="bg-background py-10" id="sign-in">
        <div className="max-w-[1080px] mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-8">Ticket purchasing</h2>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <section className="bg-background py-10" id="sign-in">
      <div className="max-w-[1080px] mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground mb-8">Ticket purchasing</h2>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Buy a ticket</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TICKET_OPTIONS.map((opt) => (
              <div
                key={opt.type}
                className="border border-border rounded-sm p-4 bg-card flex flex-col"
              >
                <h4 className="font-medium text-foreground">{opt.label}</h4>
                <p className="text-sm text-muted-foreground mb-4">{opt.description}</p>
                <button
                  type="button"
                  disabled={purchaseTicket.isPending}
                  onClick={() => purchaseTicket.mutate(opt.type)}
                  className="mt-auto bg-secondary text-secondary-foreground font-semibold py-2 px-4 rounded-sm text-sm hover:opacity-90 transition-opacity disabled:opacity-70"
                >
                  {purchaseTicket.isPending ? "Purchasing..." : "Purchase"}
                </button>
              </div>
            ))}
          </div>
          {purchaseTicket.isError && (
            <p className="mt-2 text-sm text-destructive">{purchaseTicket.error?.message}</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">My tickets</h3>
          {ticketsLoading ? (
            <p className="text-muted-foreground">Loading tickets...</p>
          ) : !Array.isArray(tickets) || tickets.length === 0 ? (
            <p className="text-muted-foreground">No tickets yet. Purchase one above.</p>
          ) : (
            <ul className="space-y-3">
              {tickets.map((ticket) => (
                <li
                  key={ticket.id}
                  className="border border-border rounded-sm p-4 bg-card"
                >
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <p className="font-medium text-foreground">
                        {TICKET_OPTIONS.find((o) => o.type === ticket.type)?.label ?? ticket.type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Purchased: {new Date(ticket.purchased_at).toLocaleString()}
                      </p>
                      {ticket.expires_at && (
                        <p className="text-sm text-muted-foreground">
                          Expires: {new Date(ticket.expires_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        ticket.status === "ACTIVE"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default TicketPurchaseSection;
