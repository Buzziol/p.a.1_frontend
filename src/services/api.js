import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export default {
    async predict(file, patientId = null) {
        const formData = new FormData();
        formData.append('file', file);
        if (patientId) {
            formData.append('patient_id', patientId);
        }

        try {
            const response = await api.post('/predict', formData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Network Error');
        }
    },

    async healthCheck() {
        try {
            const response = await api.get('/health');
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Network Error');
        }
    },
};
