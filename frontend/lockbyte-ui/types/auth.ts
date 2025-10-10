export interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
  fullName: string;
  avatarUrl?: string;
}

export interface SignUpData {
  username: string;
  password: string;
  fullName: string;
  email: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
}
