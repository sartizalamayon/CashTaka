import useAllTopupReq from "../hooks/useAllTopupReq";

const TopupReq = () => {
    const [topupReq,isLoading, refetch] = useAllTopupReq()
    console.log(topupReq)
    return (
        <div>
            Topup reqs
        </div>
    );
};

export default TopupReq;