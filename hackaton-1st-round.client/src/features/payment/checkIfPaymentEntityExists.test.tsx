import checkIfPaymentEntityExists from './checkIfPaymentEntityExists';

global.fetch = jest.fn();

describe('checkIfPaymentEntityExists', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('returns data when the fetch is successful', async () => {
        const mockData = { exists: true };
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockData),
            ok: true,
        });

        const result = await checkIfPaymentEntityExists('12345');
        expect(result).toEqual(mockData);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('https://localhost:7071/api/Payment/checkPayment/12345', {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });

    test('throws an error when the fetch fails', async () => {
        const mockError = new Error('Network error');
        fetch.mockRejectedValueOnce(mockError);

        await expect(checkIfPaymentEntityExists('12345')).rejects.toThrow('Network error');
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('https://localhost:7071/api/Payment/checkPayment/12345', {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });
});