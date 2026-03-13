import { useState } from "react";
import { useRoutes, useRouteStops } from "@/hooks/use-api";

const RoutesSection = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const { data: routes, isLoading: routesLoading, error: routesError } = useRoutes();
  const { data: stops, isLoading: stopsLoading } = useRouteStops(selectedRouteId);

  if (routesLoading) {
    return (
      <section className="bg-card py-10" id="routes">
        <div className="max-w-[1080px] mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">Routes</h2>
          <p className="text-muted-foreground">Loading routes...</p>
        </div>
      </section>
    );
  }

  if (routesError) {
    return (
      <section className="bg-card py-10" id="routes">
        <div className="max-w-[1080px] mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">Routes</h2>
          <p className="text-destructive">Unable to load routes. Make sure the backend is running.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-card py-10" id="routes">
      <div className="max-w-[1080px] mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground mb-6">Campus routes</h2>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-64 flex-shrink-0">
            <h3 className="text-sm font-semibold text-foreground mb-3">Select a route</h3>
            {routes?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No routes yet. Run the seed script to add sample data.</p>
            ) : (
              <ul className="space-y-1">
                {routes?.map((route) => (
                  <li key={route.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedRouteId(route.id)}
                      className={`w-full text-left px-3 py-2 rounded-sm text-sm font-medium transition-colors ${
                        selectedRouteId === route.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      {route.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex-1">
            {selectedRouteId && (
              <>
                <h3 className="text-sm font-semibold text-foreground mb-3">Stops</h3>
                {stopsLoading ? (
                  <p className="text-muted-foreground">Loading stops...</p>
                ) : stops?.length === 0 ? (
                  <p className="text-muted-foreground">No stops on this route.</p>
                ) : (
                  <ol className="list-decimal list-inside space-y-2">
                    {stops?.map((rs) => (
                      <li key={`${rs.route_id}-${rs.stop.id}`} className="text-foreground">
                        {rs.stop.name}
                      </li>
                    ))}
                  </ol>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoutesSection;
