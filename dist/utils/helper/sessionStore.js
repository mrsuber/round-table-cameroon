"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InMemorySessionStore {
    constructor() {
        this.sessions = new Map();
    }
    findSession(id) {
        return this.sessions.get(id);
    }
    saveSession(id, session) {
        this.sessions.set(id, session);
    }
    findAllSessions() {
        return [...this.sessions.values()];
    }
}
exports.default = InMemorySessionStore;
