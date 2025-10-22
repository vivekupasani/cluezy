export function POST(request: Request) {
    const { postId }: any = request.json()
    console.log(postId)
    return new Response(`Post with ID ${postId} deleted.`, { status: 200 })
}