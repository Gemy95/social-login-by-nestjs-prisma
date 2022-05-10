import { Providers } from 'src/helpers/providers.helper';
import { Genders} from 'src/helpers/genders.helper';
import { UserStatus } from 'src/helpers/user-status.helper';


export class UserParser {
  id?: number;
  full_name?: string;
  email: string;
  phone: string;
  password?: string;
  picture_url?: string;
  gender?: Genders;
  birth_date?: Date;
  status?: UserStatus;
  referral?: string;
  provider?: Providers;
  created_at?: string;
  updated_at?: string;

  constructor() { }

  setId(Id) {
    this.id = Id;
    return this;
  }
  setFullName(full_name) {
    this.full_name = full_name;
    return this;
  }
  setEmail(email) {
    this.email = email;
    return this;
  }
  setPhone(phone) {
    this.phone = phone;
    return this;
  }
  setPictureUrl(picture_url) {
    this.picture_url = picture_url;
    return this;
  }
  setBirthDate(birth_date) {
    this.birth_date = birth_date;
    return this;
  }
  setStatus(status) {
    this.status = status;
    return this;
  }
  setReferral(referral) {
    this.referral = referral;
    return this;
  }
  setProvider(provider) {
    this.provider = provider;
    return this;
  }

}
