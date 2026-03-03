import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_tmxyhwq';
const TEMPLATE_ID = 'template_psiw80h';
const PUBLIC_KEY = 'YPXfTNPHw5HOuoUY0'; // User needs to provide actual public key

export const sendEnquiryEmail = async (data: { name: string; email: string; phone: string; service: string; message: string }) => {
    try {
        const templateParams = {
            from_name: data.name,
            from_email: data.email,
            phone: data.phone,
            service_type: data.service,
            message: data.message,
            to_name: 'Muneeswaran',
            to_email: 'muneeswaranmd2004@gmail.com',
        };

        const result = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams,
            PUBLIC_KEY
        );
        return result;
    } catch (error) {
        console.error('EmailJS Enquiry Error:', error);
        throw error;
    }
};

export const sendHiringEmail = async (data: { name: string; email: string; position: string; portfolio: string; message: string }) => {
    try {
        const templateParams = {
            from_name: data.name,
            from_email: data.email,
            position: data.position,
            portfolio: data.portfolio,
            message: data.message,
            to_name: 'Muneeswaran',
            to_email: 'muneeswaranmd2004@gmail.com',
        };

        const result = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams,
            PUBLIC_KEY
        );
        return result;
    } catch (error) {
        console.error('EmailJS Hiring Error:', error);
        throw error;
    }
};

export const sendDemoEmail = async (data: { name: string; email: string; company: string; phone: string; message: string }) => {
    try {
        const templateParams = {
            from_name: data.name,
            from_email: data.email,
            company: data.company,
            phone: data.phone,
            message: data.message,
            product: 'Averqon Billing Software',
            to_name: 'Muneeswaran',
            to_email: 'muneeswaranmd2004@gmail.com',
        };

        const result = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams,
            PUBLIC_KEY
        );
        return result;
    } catch (error) {
        console.error('EmailJS Demo Error:', error);
        throw error;
    }
};
