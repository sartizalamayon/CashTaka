import useAllTopupReq from "../hooks/useAllTopupReq";

const TopupReq = () => {
    const [topupReq,isLoading, refetch] = useAllTopupReq()
    
    return (
        <div>
            Topup
        </div>
    );
};

export default TopupReq;