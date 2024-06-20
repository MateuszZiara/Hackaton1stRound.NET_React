import { checkUserLoggedIn, gethasTeam, logout } from './getCookies';
// Mockowanie globalnego fetch
global.fetch = jest.fn();

describe('checkUserLoggedIn', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('returns true when the fetch is successful', async () => {
        fetch.mockResolvedValueOnce({ ok: true });

        const result = await checkUserLoggedIn();
        expect(result).toBe(true);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('https://localhost:7071/api/AspNetUsers/info', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }
        });
    });

    test('returns false when the fetch fails', async () => {
        fetch.mockResolvedValueOnce({ ok: false });

        const result = await checkUserLoggedIn();
        expect(result).toBe(false);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('https://localhost:7071/api/AspNetUsers/info', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }
        });
    });
});

describe('gethasTeam', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('returns true when the user has a team', async () => {
        const mockData = { teamEntity_FK: 'teamId' };
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockData),
            ok: true
        });

        const result = await gethasTeam();
        expect(result).toBe(true);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('https://localhost:7071/api/AspNetUsers/info', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }
        });
    });

    test('returns false when the user does not have a team', async () => {
        const mockData = { teamEntity_FK: null };
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockData),
            ok: true
        });

        const result = await gethasTeam();
        expect(result).toBe(false);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('https://localhost:7071/api/AspNetUsers/info', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }
        });
    });
});

describe('logout', () => {
    beforeEach(() => {
        fetch.mockClear();
        delete window.location;
        window.location = { href: jest.fn() };
    });

    test('calls the logout API and redirects', async () => {
        fetch.mockResolvedValueOnce({ ok: true });

        await logout();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('https://localhost:7071/api/AspNetUsers/logout', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }
        });
        expect(window.location.href).toBe('/pag');
    });
});

