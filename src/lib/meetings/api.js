// 회의록 관련 API 함수들

// 회의록 목록 가져오기 (내부 API Route 사용)
export async function getMeetings() {
  try {
    const response = await fetch('/api/meetings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch meetings:', error)
    throw error
  }
}

// 특정 회의록 상세 정보 가져오기 (필요시 사용)
export async function getMeetingById(id) {
  try {
    const meetings = await getMeetings()
    return meetings.find(meeting => meeting.script_id === id)
  } catch (error) {
    console.error('Failed to fetch meeting:', error)
    throw error
  }
}

// 회의록 검색
export async function searchMeetings(query) {
  try {
    const meetings = await getMeetings()
    
    if (!query || query.trim() === '') {
      return meetings
    }

    const searchQuery = query.toLowerCase()
    return meetings.filter(meeting => 
      meeting.title.toLowerCase().includes(searchQuery) ||
      meeting.script_summaries.toLowerCase().includes(searchQuery) ||
      meeting.speakers.toLowerCase().includes(searchQuery) ||
      meeting.tags.some(tag => tag.toLowerCase().includes(searchQuery))
    )
  } catch (error) {
    console.error('Failed to search meetings:', error)
    throw error
  }
}

// 태그별 회의록 필터링
export async function getMeetingsByTag(tag) {
  try {
    const meetings = await getMeetings()
    return meetings.filter(meeting => 
      meeting.tags.includes(tag)
    )
  } catch (error) {
    console.error('Failed to filter meetings by tag:', error)
    throw error
  }
}
