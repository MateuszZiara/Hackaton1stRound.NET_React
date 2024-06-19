export default async function postNewPaypal(props) {
    const url = "https://localhost:7071/paypal";
    const data = {
            name: props.name,
            description: props.description,
            price: props.price, // corrected to use product.price
            isApproved: props.status,
            userId : props.user,
            teamId : props.team,
        };
    console.log(JSON.stringify(props));
    console.log(JSON.stringify(data));
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