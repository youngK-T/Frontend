import { NextResponse } from 'next/server'

const SCRIPT_API_URL = 'https://scriptcreateservice06-a6buhjcfbnfbcuhz.koreacentral-01.azurewebsites.net/api/scripts'

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const response = await fetch(`${SCRIPT_API_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // segments를 읽기 쉬운 형태로 변환
    if (data.segments && Array.isArray(data.segments)) {
      const formattedScript = data.segments
        .map(segment => `[${segment.speaker}] ${segment.text}`)
        .join('\n\n')
      
      data.formatted_script = formattedScript
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
    console.error('Failed to fetch meeting script from external API:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch meeting script', message: error.message },
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
