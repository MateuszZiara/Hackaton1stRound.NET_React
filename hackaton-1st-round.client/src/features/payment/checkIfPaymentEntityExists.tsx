export default async function checkIfPaymentEntityExists(teamId) {
    const url = `https://localhost:7071/api/Payment/checkPayment/${teamId}`;

    try {
        const response = await fetch(url, {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        console.log(data); // Zalogowanie danych otrzymanych z serwera

        // Sprawdzenie, czy otrzymane dane wskazują na istnienie płatności
        // Zwracamy wartość true/false w zależności od odpowiedzi serwera
        return data; // Załóżmy, że odpowiedź z serwera zawiera pole 'exists', które informuje o istnieniu płatności
    } catch (error) {
        console.error('Error checking payment entity:', error);
        throw error; // Rzucenie błędu dalej, aby móc go obsłużyć w wywołującym kodzie
    }
}
