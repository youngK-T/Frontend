// 공통 API 유틸리티 함수들

// 기본 fetch 래퍼 함수
export async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// GET 요청 헬퍼
export async function apiGet(url, options = {}) {
  return apiRequest(url, { method: 'GET', ...options })
}

// POST 요청 헬퍼
export async function apiPost(url, data, options = {}) {
  return apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  })
}

// PUT 요청 헬퍼
export async function apiPut(url, data, options = {}) {
  return apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  })
}

// DELETE 요청 헬퍼
export async function apiDelete(url, options = {}) {
  return apiRequest(url, { method: 'DELETE', ...options })
}
