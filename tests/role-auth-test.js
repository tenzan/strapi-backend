const axios = require('axios');

const API_URL = 'http://localhost:1337';
let savedToken = null;
let savedRoleId = null;

const testRoleAuth = async () => {
  try {
    console.log('🚀 Starting role authentication tests...\n');

    // 1. Get ABC Corp customer and its role
    console.log('1️⃣  Fetching ABC Corp customer role...');
    const customerResponse = await axios.get(`${API_URL}/api/app-roles?filters[customer][code][$eq]=abc-corp&populate=customer`);
    
    if (!customerResponse.data.data || customerResponse.data.data.length === 0) {
      throw new Error('No role found for ABC Corp');
    }

    const role = customerResponse.data.data[0];
    savedRoleId = role.id;
    savedToken = role.attributes.accessToken;
    
    console.log('✅ Found role:', {
      id: role.id,
      name: role.attributes.name,
      type: role.attributes.type,
      customerName: role.attributes.customer.data.attributes.name
    });
    console.log('🔑 Access Token:', savedToken, '\n');

    // 2. Validate the token
    console.log('2️⃣  Validating token...');
    const validateResponse = await axios.get(`${API_URL}/api/app-roles/validate`, {
      headers: {
        'x-access-token': savedToken
      }
    });

    console.log('✅ Token validation successful:', validateResponse.data, '\n');

    // 3. Refresh the token
    console.log('3️⃣  Refreshing token...');
    const refreshResponse = await axios.post(`${API_URL}/api/app-roles/${savedRoleId}/refresh-token`);
    
    console.log('✅ Token refresh successful');
    console.log('🔑 New Access Token:', refreshResponse.data.accessToken, '\n');

    // 4. Validate the new token
    console.log('4️⃣  Validating new token...');
    const newValidateResponse = await axios.get(`${API_URL}/api/app-roles/validate`, {
      headers: {
        'x-access-token': refreshResponse.data.accessToken
      }
    });

    console.log('✅ New token validation successful:', newValidateResponse.data, '\n');

    console.log('🎉 All tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

// Run the tests
testRoleAuth();
