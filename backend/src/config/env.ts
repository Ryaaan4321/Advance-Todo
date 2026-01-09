import dotnev from 'dotenv'
dotnev.config();
export const ACCESS_SECRET = (() => {
  const secret = process.env.ACCESS_SECRET;
  console.log("Secret == ",secret);
  if (!secret) {
    throw new Error("ACCESS_SECRET is not defined");
  }
  return secret;
})();

export const REFRESH_SECRET=(()=>{
  const secret=process.env.REFRESH_TOKEN;
  console.log("refreesh ",secret);
  if(!secret){
    throw new Error("REFRESH_SECRET is not defined");
  }
  return secret;
})
