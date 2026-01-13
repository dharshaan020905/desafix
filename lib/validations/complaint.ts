import { z } from 'zod';

// Sanitize input to remove dangerous characters
const sanitizeString = (str: string): string => {
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove onclick=, onload=, etc.
    .replace(/['"]/g, ''); // Remove quotes
};

// Define valid facility types
const facilityTypes = [
  'Air Conditioning',
  'Plumbing',
  'Electrical',
  'Door/Window',
  'Furniture',
  'Internet',
  'Other',
] as const;

// Define valid urgency levels
const urgencyLevels = ['Low', 'Medium', 'High'] as const;

// Define valid hostels
const hostels = [
  'Desasiswa Aman Damai',
  'Desasiswa Fajar Harapan',
  'Desasiswa Bakti Permai',
  'Desasiswa Indah Kembara',
  'Desasiswa Cahaya Gemilang',
  'Desasiswa Restu',
  'Desasiswa Tekun',
  'Desasiswa Saujana',
] as const;

// Complaint submission schema
export const complaintSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters long')
    .max(100, 'Title must not exceed 100 characters')
    .transform(sanitizeString)
    .refine(
      (val) => val.length >= 5,
      'Title must contain at least 5 meaningful characters after sanitization'
    ),
  
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters long')
    .max(1000, 'Description must not exceed 1000 characters')
    .transform(sanitizeString)
    .refine(
      (val) => val.length >= 20,
      'Description must contain at least 20 meaningful characters after sanitization'
    ),
  
  facility_type: z
    .enum(facilityTypes, {
      message: 'Please select a valid facility type',
    }),
  
  urgency: z
    .enum(urgencyLevels, {
      message: 'Please select a valid urgency level',
    }),
  
  hostel: z
    .enum(hostels, {
      message: 'Please select a valid hostel',
    }),
  
  room_number: z
    .string()
    .min(1, 'Room number is required')
    .max(10, 'Room number must not exceed 10 characters')
    .transform(sanitizeString)
    .refine(
      (val) => val.length >= 1,
      'Room number must contain at least 1 character after sanitization'
    ),
});

// Type inference
export type ComplaintFormData = z.infer<typeof complaintSchema>;

// Export constants for use in components
export { facilityTypes, urgencyLevels, hostels };