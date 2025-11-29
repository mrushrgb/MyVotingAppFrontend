function computeElectionStatus(election) {
    try {
        const now = new Date();

        const parseLenient = (value) => {
            if (!value) return null;
            const s = String(value);
            if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
                const dt = new Date(s + 'T00:00:00');
                return isNaN(dt.getTime()) ? null : dt;
            }
            const dt = new Date(s);
            return isNaN(dt.getTime()) ? null : dt;
        };

        const startsRaw = election?.startsAt || election?.date || null;
        const endsRaw = election?.endsAt || election?.date || null;

        const starts = parseLenient(startsRaw);
        let ends = parseLenient(endsRaw);

        const rawEnds = election?.endsAt || election?.date;
        if (ends && typeof rawEnds === 'string') {
            const rawStr = String(rawEnds);
            if (/^(\d{4}-\d{2}-\d{2})$/.test(rawStr)) {
                const e = new Date(ends);
                e.setHours(23, 59, 59, 999);
                ends = e;
            } else {
                const midnIso = /T00:00:00(?:\.0+)?Z?$/.test(rawStr);
                if (midnIso) {
                    const e = new Date(ends);
                    e.setHours(23, 59, 59, 999);
                    ends = e;
                }
            }
        }

        if (starts && ends) {
            if (starts <= now && ends >= now) return 'active';
            if (starts > now) return 'upcoming';
            if (ends < now) return 'completed';
        }

        return election?.status || 'unknown';
    } catch (e) {
        return election?.status || 'unknown';
    }
}

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const todayStr = `${yyyy}-${mm}-${dd}`;

const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const yyyyy = yesterday.getFullYear();
const ymm = String(yesterday.getMonth() + 1).padStart(2, '0');
const ydd = String(yesterday.getDate()).padStart(2, '0');
const yesterdayStr = `${yyyyy}-${ymm}-${ydd}`;

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const tyyyy = tomorrow.getFullYear();
const tmm = String(tomorrow.getMonth() + 1).padStart(2, '0');
const tdd = String(tomorrow.getDate()).padStart(2, '0');
const tomorrowStr = `${tyyyy}-${tmm}-${tdd}`;

const samples = [
    { id: 'a', title: 'Ends Today (date-only)', date: todayStr },
    { id: 'b', title: 'Ended Yesterday (date-only)', date: yesterdayStr },
    { id: 'c', title: 'Ends Tomorrow (date-only)', date: tomorrowStr },
    { id: 'd', title: 'Starts Yesterday Ends Today (ISO)', startsAt: yesterday.toISOString(), endsAt: today.toISOString() },
    { id: 'e', title: 'Starts Yesterday Ends Today (date-only strings)', startsAt: yesterdayStr, endsAt: todayStr },
    { id: 'f', title: 'Starts Today Ends Today but time earlier (ISO)', startsAt: new Date().toISOString(), endsAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
    { id: 'g', title: 'Ends at UTC midnight (ISO) for tomorrow - treat as end-of-day', startsAt: yesterdayStr + 'T00:00:00.000Z', endsAt: tomorrowStr + 'T00:00:00.000Z' },
];

console.log('Now:', new Date().toString());
for (const s of samples) {
    console.log('\n', s.title, '\n', s);
    console.log('Status ->', computeElectionStatus(s));
}
