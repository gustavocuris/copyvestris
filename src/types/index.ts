export interface Registration {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  professionalType: string;
  clinicName?: string;
  city?: string;
  interest?: string;
  createdAt: string;
  createdAtRaw: string;
  referralSource?: string;
}
