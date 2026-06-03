let API_URL = process.env.REACT_APP_API_URL || 'https://provedordoc-1.onrender.com';
if (process.env.NODE_ENV === 'development') {
	API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
}
export default API_URL;
