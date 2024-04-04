import { NextResponse } from 'next/server';
const publicPaths = ['/signIn', '/signUp','/welcome','/message/inbox'];


export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const authToken = await request.cookies.get("authToken")?.value ;
  if(path === '/'){
    console.log(authToken);
    if (authToken) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/welcome',request.url));
  }
  if (publicPaths.includes(path)) {
    if (authToken) {
      return NextResponse.redirect(new URL('/',request.url));
    }
    return NextResponse.next();
  } else {
    if (authToken) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/signIn',request.url));
  }
}

// Configuration for matching paths
export const config = {
  matcher: [
    '/',
    '/welcome',
    '/signUp',
    '/signIn',
    '/setting',
    '/search',
    '/profile',
    '/post/updatepost',
    '/post/createpost',
    '/message',
    '/message/inbox',
    '/notifications'
  ],
};
