import { format } from 'date-fns';

export function generateSerialNumber(): string {
  // Format: SR-YYYYMMDD-XXXX where X is a random number
  const dateString = format(new Date(), 'yyyyMMdd');
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `SR-${dateString}-${randomPart}`;
}