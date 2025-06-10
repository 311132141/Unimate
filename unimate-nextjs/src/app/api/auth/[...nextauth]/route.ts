import NextAuth from 'next-auth';
// import { authOptions } from '@/lib/auth/authOptions';

const authOptions = {
    providers: [],
    session: { strategy: 'jwt' as const },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
