import { Profile } from "@prisma/client";

const bestProfilesOrdereds = [
  'master',
  'admin',
  'seller',
  'customer'
]

const getBestProfile = (profiles: Profile[]): Profile | null => {
  // let best: Profile | null = null;
  bestProfilesOrdereds.forEach(b => profiles.some(e => {
    if (b === e.tag) {
      return e;
    }
  }))
  return null;
}

export default getBestProfile;
