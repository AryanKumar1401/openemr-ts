import { openemrApi } from '@/lib/openemr-api';

export interface Patient {
    id?: string;
    uuid?: string;
    fname: string;
    lname: string;
    mname?: string;
    DOB: string;
    sex: 'Male' | 'Female' | 'Other';
    status: 'active' | 'inactive' | 'deceased';
    providerID?: number;
    pubpid?: string;
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country_code?: string;
    phone_home?: string;
    phone_biz?: string;
    phone_cell?: string;
    email?: string;
}

export interface PatientSearchParams {
    fname?: string;
    lname?: string;
    DOB?: string;
    sex?: string;
    status?: string;
    city?: string;
    state?: string;
    postal_code?: string;
}

export const patientService = {
    async getPatients(searchParams?: PatientSearchParams) {
        const response = await openemrApi.get('/api/patient', {
            params: searchParams
        });
        return response.data;
    },

    async getPatient(uuid: string) {
        const response = await openemrApi.get(`/api/patient/${uuid}`);
        return response.data;
    },

    async createPatient(patientData: Patient) {
        const response = await openemrApi.post('/api/patient', patientData);
        return response.data;
    },

    async updatePatient(uuid: string, patientData: Patient) {
        const response = await openemrApi.put(`/api/patient/${uuid}`, patientData);
        return response.data;
    },

    async deletePatient(uuid: string) {
        const response = await openemrApi.delete(`/api/patient/${uuid}`);
        return response.data;
    }
}; 