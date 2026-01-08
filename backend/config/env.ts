// backend/config/env.ts
export const ACCESS_SECRET = (() => {
  const secret = process.env.ACCESS_SECRET;
  if (!secret) {
    throw new Error("ACCESS_SECRET is not defined");
  }
  return secret;
})();

export const REFRESH_SECRET=(()=>{
  const secret=process.env.REFRESH_TOKEN;
  if(!secret){
    throw new Error("REFRESH_SECRET is not defined");
  }
  return secret;
})
