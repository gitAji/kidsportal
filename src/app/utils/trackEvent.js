// Fire-and-forget behavior logging for the pilot cohort. Never throws and
// never blocks the UI — a dropped event just means one less data point,
// not a broken lesson or quiz. `keepalive` lets the request survive a
// navigation that happens right after (e.g. finishing a lesson).
export function trackEvent(childId, event, metadata = {}) {
    if (!childId || !event || typeof window === 'undefined') return;
    try {
        fetch('/api/behavior-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ childId, event, metadata }),
            keepalive: true,
        }).catch(() => { });
    } catch { }
}
