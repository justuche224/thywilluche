import {BookPage} from "@/components/shop/books/book-page";

const page = async ({params}: { params: Promise<{ bookSlug: string }> }) => {

    const {bookSlug} = await params
    return (
        <div>
            <BookPage bookSlug={bookSlug}/>
        </div>
    )
}
export default page