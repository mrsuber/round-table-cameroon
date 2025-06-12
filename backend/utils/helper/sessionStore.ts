class InMemorySessionStore {
    public sessions: Map<string, any>
    constructor() {
        this.sessions = new Map()
    }

    findSession(id: string) {
        return this.sessions.get(id)
    }

    saveSession(id: string, session: any) {
        this.sessions.set(id, session)
    }

    findAllSessions() {
        return [...this.sessions.values()]
    }
}

export default InMemorySessionStore
