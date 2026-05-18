export declare class CreateCardDto {
    fullName: string;
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
    department?: string;
    company?: string;
    companyWebsite?: string;
    email?: string;
    phoneWork?: string;
    phoneMobile?: string;
    phoneOther?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    linkedIn?: string;
    twitter?: string;
    customFields?: Record<string, any>;
    gstin?: string;
    isBadge?: boolean;
    rawExtractedText?: string;
    frontImageUrl?: string;
    backImageUrl?: string;
    confidence?: number;
}
