export async function GET() {
  try {
    const response = await fetch(
      'https://report-source-e7haeydbc7fngjdy.koreacentral-01.azurewebsites.net/api/report-sources/tags?limit=20',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const tags = await response.json()

    return new Response(JSON.stringify(tags), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    console.error('Tags API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch tags', details: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
}
