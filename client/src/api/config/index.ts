// export const baseUrl = 'http://localhost:8080'
export const baseUrl = 'https://www.roundtable.subercraftex.com'
// export const endpoint = 'http://localhost:8080/api'
// export const endpoint = 'https://round-table-platform.onrender.com/api'
export const endpoint = 'https://www.roundtable.subercraftex.com/api';

export const prepareUserUrl = (url: string) => `${endpoint}/users/${url}`
export const prepareContactsUrl = (url: string) => `${endpoint}/contacts/${url}`
export const prepareProjectsUrl = (url: string) => `${endpoint}/projects/${url}`
export const prepareTasksUrl = (url: string) => `${endpoint}/tasks/${url}`
export const prepareChatsUrl = (url: string) => `${endpoint}/messages/${url}`
export const prepareDonationsUrl = (url: string) => `${endpoint}/donations/${url}`
