import { NextResponse } from 'next/server'

const API_KEY = process.env.YOUTUBE_API_KEY
const PLAYLIST_IDS = [
  'PLrQ8J1OVBDNVT_jFpdeF4LOFLfN_ZkaKd',
  'PLrQ8J1OVBDNVVXXQ1fgjRblqoUSrFmfLC',
]

export async function GET() {
  try {
    const fetchPlaylist = async (playlistId: string) => {
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=10&key=${API_KEY}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch playlist')
      const data = await res.json()
      return data.items.map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        publishedAt: item.snippet.publishedAt,
      }))
    }

    const allVideos = await Promise.all(PLAYLIST_IDS.map(fetchPlaylist))

    // 🔁 Combine and deduplicate by video ID
    const seen = new Set<string>()
    const combinedUnique = allVideos
      .flat()
      .filter((video) => {
        if (seen.has(video.id)) return false
        seen.add(video.id)
        return true
      })

    // 🔽 Sort by published date, pick newest 6
    const sorted = combinedUnique
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 6)

    return NextResponse.json(sorted)
  } catch (error) {
    console.error('Error fetching YouTube videos:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}
