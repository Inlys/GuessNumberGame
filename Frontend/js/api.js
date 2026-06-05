const API_BASE = 'http://localhost:5000/api';

const API_ERRORS = {
  'InvalidCredentials': '用户名或密码错误',
  'UserAlreadyExists': '用户已存在',
  'InvalidToken': '令牌无效或已过期',
  'Unauthorized': '未授权',
  'InvalidGuess': '无效的猜测',
  'GameNotFound': '游戏不存在',
  'GameAlreadyFinished': '游戏已完成',
  'NetworkError': '网络错误，请检查连接',
  'ServerError': '服务器错误'
};

async function apiCall(method, path, body = null, token = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(API_BASE + path, options);
    const data = await response.json();

    if (!response.ok) {
      const errorKey = data.code || 'ServerError';
      const errorMsg = API_ERRORS[errorKey] || data.message || API_ERRORS['ServerError'];
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(API_ERRORS['NetworkError']);
    }
    throw error;
  }
}

async function apiPost(path, body, token = null) {
  return apiCall('POST', path, body, token);
}

async function apiGet(path, token = null) {
  return apiCall('GET', path, null, token);
}

async function apiPut(path, body, token = null) {
  return apiCall('PUT', path, body, token);
}

async function apiDelete(path, token = null) {
  return apiCall('DELETE', path, null, token);
}
