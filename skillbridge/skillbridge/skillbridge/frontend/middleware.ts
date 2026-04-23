import { WithClerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in",
  "/sign-up",
  "/onboarding",
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    return auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$).*)"],
};
function clerkMiddleware(arg0: (auth: any, req: any) => any) {
  throw new Error("Function not implemented.");
}

