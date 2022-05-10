export function getRandomOtp() {
   return Math.floor(10000 + Math.random() * 90000).toString(); // return random 4 digits as otp
}