import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import setCommonCorsHeaders from './setCommonCorsHeaders';
import NextCors from 'nextjs-cors';


// export async function middleware(req: any, res: any) {
//     console.log("MIDDLEWARE RAN")
//   // if (req.nextUrl.pathname.startsWith('/api/posts')) {
//   //   const response = NextResponse.next({
//   //     request: {
//   //       headers: req.headers,
//   //     },
//   //   });
//     // response.headers.set('Access-Control-Allow-Origin', 'https://nomax.vercel.app, https://nomax-git-testing-onboardingform-rilladubz.vercel.app');
//     // response.headers.set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH');
//     // response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

//     // setCommonCorsHeaders()
    
//   //   return response;
//   // }
//   console.log("REQ HEADER: ")
// //   await NextCors(req, res, {
// //     // Options
// //     methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
// //     origin: '*',
// //     optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// //  });



// }

// export const config = {
//   matcher: ['/api/posts'],
// }