import { useState } from "react";
import { useCurrentUser, useDeleteTicket, useDeleteTickets, useMyTickets, usePurchaseTicket } from "@/hooks/use-api";
import type { TicketType } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TICKET_OPTIONS: { type: TicketType; label: string; description: string; priceCents: number }[] = [
  { type: "SHUTTLE_SINGLE", label: "Single ride", description: "Valid for 2 hours", priceCents: 325 },
  { type: "SHUTTLE_DAY", label: "Day pass", description: "Valid for 24 hours", priceCents: 800 },
  { type: "GUEST", label: "Guest ticket", description: "Valid for 7 days", priceCents: 500 },
];

const formatPrice = (priceCents: number) => `$${(priceCents / 100).toFixed(2)} CAD`;

const TicketPurchaseSection = () => {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: tickets, isLoading: ticketsLoading } = useMyTickets(user ?? null);
  const purchaseTicket = usePurchaseTicket();
  const deleteTicket = useDeleteTicket();
  const deleteTickets = useDeleteTickets();
  const [pendingOption, setPendingOption] = useState<(typeof TICKET_OPTIONS)[number] | null>(null);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedTicketIds, setSelectedTicketIds] = useState<string[]>([]);

  const openConfirm = (option: (typeof TICKET_OPTIONS)[number]) => {
    setPendingOption(option);
  };

  const closeConfirm = () => {
    if (purchaseTicket.isPending) return;
    setPendingOption(null);
  };

  const confirmPurchase = () => {
    if (!pendingOption) return;
    purchaseTicket.mutate(pendingOption.type, {
      onSuccess: () => {
        setPendingOption(null);
      },
    });
  };

  const allTicketIds = Array.isArray(tickets) ? tickets.map((ticket) => ticket.id) : [];
  const allSelected = allTicketIds.length > 0 && allTicketIds.every((ticketId) => selectedTicketIds.includes(ticketId));

  const enterSelectMode = () => {
    setIsSelectMode(true);
    setSelectedTicketIds([]);
  };

  const exitSelectMode = () => {
    setIsSelectMode(false);
    setSelectedTicketIds([]);
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedTicketIds([]);
      return;
    }
    setSelectedTicketIds(allTicketIds);
  };

  const toggleTicketSelection = (ticketId: string) => {
    setSelectedTicketIds((prev) => (
      prev.includes(ticketId) ? prev.filter((id) => id !== ticketId) : [...prev, ticketId]
    ));
  };

  const deleteSingleTicket = (ticketId: string) => {
    const confirmed = window.confirm("Delete this ticket from your account? This action cannot be undone.");
    if (!confirmed) return;
    deleteTicket.mutate(ticketId);
  };

  const deleteSelectedTickets = () => {
    if (selectedTicketIds.length === 0) return;
    const confirmed = window.confirm(`Delete ${selectedTicketIds.length} selected ticket(s)?`);
    if (!confirmed) return;
    deleteTickets.mutate(selectedTicketIds, {
      onSuccess: () => {
        exitSelectMode();
      },
    });
  };

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
                <p className="text-sm font-semibold text-foreground mb-4">{formatPrice(opt.priceCents)}</p>
                <button
                  type="button"
                  disabled={purchaseTicket.isPending}
                  onClick={() => openConfirm(opt)}
                  className="mt-auto bg-secondary text-secondary-foreground font-semibold py-2 px-4 rounded-sm text-sm hover:opacity-90 transition-opacity disabled:opacity-70"
                >
                  Purchase
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
            <>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {!isSelectMode ? (
                  <Button type="button" variant="outline" size="sm" onClick={enterSelectMode}>
                    Select
                  </Button>
                ) : (
                  <>
                    <Button type="button" variant="outline" size="sm" onClick={toggleSelectAll}>
                      {allSelected ? "Clear all" : "Select all"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={deleteSelectedTickets}
                      disabled={selectedTicketIds.length === 0 || deleteTickets.isPending}
                    >
                      {deleteTickets.isPending ? "Deleting..." : `Delete selected (${selectedTicketIds.length})`}
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={exitSelectMode} disabled={deleteTickets.isPending}>
                      Done
                    </Button>
                  </>
                )}
              </div>

              <ul className="space-y-3">
                {tickets.map((ticket) => (
                  <li
                    key={ticket.id}
                    className="group relative border border-border rounded-sm p-4 bg-card"
                  >
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div className="flex items-start gap-3">
                        {isSelectMode && (
                          <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 accent-primary"
                            checked={selectedTicketIds.includes(ticket.id)}
                            onChange={() => toggleTicketSelection(ticket.id)}
                          />
                        )}
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

                    {!isSelectMode && (
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-xs px-2 py-1 rounded border border-border text-muted-foreground opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:text-destructive hover:border-destructive transition-all disabled:opacity-50"
                        disabled={deleteTicket.isPending}
                        onClick={() => deleteSingleTicket(ticket.id)}
                      >
                        {deleteTicket.isPending ? "Deleting..." : "Delete"}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
          {deleteTicket.isError && !isSelectMode && (
            <p className="mt-2 text-sm text-destructive">{deleteTicket.error?.message}</p>
          )}
          {deleteTickets.isError && (
            <p className="mt-2 text-sm text-destructive">{deleteTickets.error?.message}</p>
          )}
        </div>
      </div>

      <Dialog open={!!pendingOption} onOpenChange={(nextOpen) => !nextOpen && closeConfirm()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm purchase</DialogTitle>
            <DialogDescription>
              Review your ticket details before completing this purchase.
            </DialogDescription>
          </DialogHeader>

          {pendingOption && (
            <div className="rounded-md border border-border bg-card p-4 space-y-2">
              <p className="text-sm text-muted-foreground">Ticket type</p>
              <p className="font-semibold text-foreground">{pendingOption.label}</p>
              <p className="text-sm text-muted-foreground">{pendingOption.description}</p>
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground">Total price</p>
                <p className="text-lg font-bold text-foreground">{formatPrice(pendingOption.priceCents)}</p>
              </div>
            </div>
          )}

          {purchaseTicket.isError && (
            <p className="text-sm text-destructive">{purchaseTicket.error?.message}</p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeConfirm} disabled={purchaseTicket.isPending}>
              Cancel
            </Button>
            <Button type="button" onClick={confirmPurchase} disabled={purchaseTicket.isPending || !pendingOption}>
              {purchaseTicket.isPending ? "Processing..." : "Confirm purchase"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default TicketPurchaseSection;
