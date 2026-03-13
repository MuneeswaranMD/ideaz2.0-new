
export const triggerAutoResponse = async (data: any, source: string) => {
    try {
        // Change back to /webhook/ for production once testing is done
        const url = 'https://n8n-m45f.onrender.com/webhook-test/enquiry-response';

        // We use URLSearchParams to create a "Simple Request"
        // This avoids the CORS preflight OPTIONS request that is failing.
        const formData = new URLSearchParams();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });
        formData.append('source', source);
        formData.append('submittedAt', new Date().toISOString());

        // 'no-cors' allows the request to be sent even if the server doesn't have CORS headers.
        await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // With no-cors, we can't read the response, so we return true if no network error occurred
        return true;
    } catch (error) {
        console.warn(`[Automation] ${source} trigger failed:`, error);
        return false;
    }
};
