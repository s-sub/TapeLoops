export const maxFilesPerUser = 9
export const maxFileSize = 4000000 //4MB

const prodApiUrl = 'https://tapeloop-server.onrender.com/api'
const devApiUrl = 'http://localhost:3001/api'

export const apiBaseUrl = process.env.NODE_ENV === 'development' ? devApiUrl : prodApiUrl;
