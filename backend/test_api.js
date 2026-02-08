import axios from 'axios';

async function testApi() {
    try {
        const response = await axios.get('http://localhost:5000/api/courses/10');
        console.log('SUCCESS:', response.data);
    } catch (error) {
        if (error.response) {
            console.log('ERROR STATUS:', error.response.status);
            console.log('ERROR DATA:', error.response.data);
        } else {
            console.log('ERROR MESSAGE:', error.message);
        }
    }
}

testApi();
