import { NextResponse } from 'next/server'

const EXTERNAL_API_URL = 'https://report-source-e7haeydbc7fngjdy.koreacentral-01.azurewebsites.net/api/report-sources'

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const response = await fetch(`${EXTERNAL_API_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // meeting_minutes가 없는 경우 minutes 데이터 사용
    if (!data.meeting_minutes && data.minutes) {
      data.meeting_minutes = data.minutes
    }
    
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    console.error('Failed to fetch meeting detail from external API:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch meeting detail', message: error.message },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
