// @ts-check
const { test, expect } = require('@playwright/test');

function uniqueUser() {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return {
    username: `pw55333_${suffix}`,
    email: `pw55333_${suffix}@example.com`,
  };
}

async function register(request, { username, email, password }) {
  return await request.post('/api/users', {
    data: { user: { username, email, password } },
  });
}

async function login(request, { email, password }) {
  return await request.post('/api/users/login', {
    data: { user: { email, password } },
  });
}

async function changePassword(request, token, { currentPassword, newPassword }) {
  return await request.put('/api/user/password', {
    headers: { Authorization: `Token ${token}` },
    data: { user: { currentPassword, newPassword } },
  });
}

test.describe('Change password (EPMCDMETST-55333)', () => {
  test('Change password succeeds with correct current password', async ({ request }) => {
    const user = uniqueUser();
    const oldPassword = 'OldPass!123';
    const newPassword = 'NewPass!123';

    const reg = await register(request, { ...user, password: oldPassword });
    expect(reg.status(), await reg.text()).toBe(201);

    const loginOld = await login(request, { email: user.email, password: oldPassword });
    expect(loginOld.status(), await loginOld.text()).toBe(200);
    const token = (await loginOld.json()).user.token;

    const chg = await changePassword(request, token, {
      currentPassword: oldPassword,
      newPassword,
    });
    expect(chg.status(), await chg.text()).toBe(200);

    const loginOldAfter = await login(request, { email: user.email, password: oldPassword });
    expect(loginOldAfter.status(), await loginOldAfter.text()).toBe(422);

    const loginNew = await login(request, { email: user.email, password: newPassword });
    expect(loginNew.status(), await loginNew.text()).toBe(200);
  });

  test('Change password fails with wrong current password', async ({ request }) => {
    const user = uniqueUser();
    const password = 'OldPass!123';

    const reg = await register(request, { ...user, password });
    expect(reg.status(), await reg.text()).toBe(201);

    const loginRes = await login(request, { email: user.email, password });
    expect(loginRes.status(), await loginRes.text()).toBe(200);
    const token = (await loginRes.json()).user.token;

    const chg = await changePassword(request, token, {
      currentPassword: 'WrongPass!999',
      newPassword: 'NewPass!123',
    });

    expect(chg.status(), await chg.text()).toBe(422);
    const body = await chg.json();
    expect(body).toEqual({ errors: { currentPassword: ['is incorrect'] } });
  });

  test('Change password fails when new password is missing', async ({ request }) => {
    const user = uniqueUser();
    const password = 'OldPass!123';

    const reg = await register(request, { ...user, password });
    expect(reg.status(), await reg.text()).toBe(201);

    const loginRes = await login(request, { email: user.email, password });
    expect(loginRes.status(), await loginRes.text()).toBe(200);
    const token = (await loginRes.json()).user.token;

    // Send explicit null so it is included in JSON and triggers backend validation.
    const chg = await changePassword(request, token, {
      currentPassword: password,
      newPassword: null,
    });

    expect(chg.status(), await chg.text()).toBe(422);
    const body = await chg.json();

    // Keep assertion high-level: validation error exists (exact key may vary)
    expect(body).toHaveProperty('errors');
    expect(Object.keys(body.errors).length).toBeGreaterThan(0);
  });
});
