document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const weatherForm = document.getElementById('weatherForm');

    // Register User
    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const lat = document.getElementById('registerLat').value;
        const lon = document.getElementById('registerLon').value;
        const role = document.getElementById('registerRole').value;

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, lat, lon, role })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Registration successful!');
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    });

    // Login User
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                // Store token in local storage
                localStorage.setItem('username', username);
                localStorage.setItem('token', data.token);
                alert('Login successful!');
            } else {
                alert(`Login failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    });

    // Get Weather Data
    weatherForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const lat = document.getElementById('lat').value;
        const lon = document.getElementById('lon').value;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in first');
                return;
            }

            const response = await fetch(`http://localhost:5000/weather/${lat}/${lon}`, {
                headers: {
                    'Authorization': `${token}`,
                }
            });

            const data = await response.json();
            if (response.ok) {
                // Display weather data
                document.getElementById('weatherResult').innerHTML = `
                    <h3>Weather Data</h3>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                `;
            } else {
                alert(`Error fetching weather: ${data.message}`);
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    });
    
    // Get Weather Forecast Data
    weatherForecastForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const lat = document.getElementById('lat').value;
        const lon = document.getElementById('lon').value;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in first');
                return;
            }

            const response = await fetch(`http://localhost:5000/weather-forecast/${lat}/${lon}`, {
                headers: {
                    'Authorization': `${token}`,
                }
            });

            const data = await response.json();
            if (response.ok) {
                // Display weather data
                document.getElementById('weatherResult').innerHTML = `
                    <h3>Weather Data</h3>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                `;
            } else {
                alert(`Error fetching weather: ${data.message}`);
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    });
    // Get Weather Data User
    weatherFormUser.addEventListener('submit', async function (event) {
        event.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');
            if (!token) {
                alert('Please log in first');
                return;
            }

            const response = await fetch(`http://localhost:5000/weather/${username}`, {
                headers: {
                    'Authorization': `${token}`,
                }
            });

            const data = await response.json();
            if (response.ok) {
                // Display weather data
                document.getElementById('weatherResult').innerHTML = `
                    <h3>Weather Data</h3>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                `;
            } else {
                alert(`Error fetching weather: ${data.message}`);
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    });
    

    
    // Get Weather Forecast Data
    weatherForcastFormUser.addEventListener('submit', async function (event) {
        event.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');
            if (!token) {
                alert('Please log in first');
                return;
            }

            const response = await fetch(`http://localhost:5000/weather-forecast/${username}`, {
                headers: {
                    'Authorization': `${token}`,
                }
            });

            const data = await response.json();
            if (response.ok) {
                // Display weather data
                document.getElementById('weatherResult').innerHTML = `
                    <h3>Weather Data</h3>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                `;
            } else {
                alert(`Error fetching weather: ${data.message}`);
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    });
});


    
