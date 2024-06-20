export default async function postNewOfflinePayment(props) {
    const url = "https://localhost:7071/api/Payment/offlinepayment";
    console.log(JSON.stringify(props));
    try {
        const response = await fetch(url, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/json',
            },
            body: JSON.stringify(props),
        });
        console.log(response);
        if (!response.ok) {

            const errorMessage = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
        } else {
            //window.location.reload();
        }
    }catch (error) {
        console.error('Error creating entity:', error);
    }

    //window.location.href = "/panel";
    //window.location.reload();


}