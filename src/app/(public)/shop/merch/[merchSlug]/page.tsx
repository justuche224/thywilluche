import {MerchPage} from "@/components/shop/merch/merch-page";

const page = async ({params}: { params: Promise<{ merchSlug: string }> }) => {

    const {merchSlug} = await params
    return (
        <div>
            <MerchPage merchSlug={merchSlug}/>
        </div>
    )
}
export default page