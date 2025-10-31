export function POST(request: Request) {
    const { postId, newName }: any = request.json()
    console.log(postId)
    console.log(newName)
    return new Response(`Post with ID ${postId} updated.`, { status: 200 })
}