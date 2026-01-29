import type { User } from './types';

const USERS: User[] = [
  {
    id: 'user-1',
    name: 'Alex Johnson',
    role: 'Manager',
  },
  {
    id: 'user-2',
    name: 'Maria Garcia',
    role: 'Specialist',
  },
];

const CREDENTIALS: { [username: string]: string } = {
  'manager': 'password123',
  'specialist': 'password123',
};

const USER_MAP: { [username: string]: User } = {
  'manager': USERS[0],
  'specialist': USERS[1],
}

export const authenticateUser = (username: string, password: string): User | null => {
  if (CREDENTIALS[username] && CREDENTIALS[username] === password) {
    return USER_MAP[username];
  }
  return null;
};
