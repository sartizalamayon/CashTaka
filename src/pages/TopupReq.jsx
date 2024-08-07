import useAllTopupReq from "../hooks/useAllTopupReq";

const TopupReq = () => {
    const [topupReq,isLoading, refetch] = useAllTopupReq()
    
    return (
        <div>
            Topup reqs
        </div>
    );
};

export default TopupReq;