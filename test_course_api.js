import axios from 'axios';

async function test() {
    try {
        const res = await axios.get('http://localhost:5000/api/courses/10');
        console.log('Status:', res.status);
        console.log('Data:', JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', JSON.stringify(err.response.data, null, 2));
        }
    }
}

test();
