import { useState, useEffect } from 'react'
import { toast } from "react-toastify";
import customFetch from '../utils/api';

function useAuthorize(props) {

    const [showPage, setShowPage] = useState(false);
    const [loading, setLoading] = useState(true);

    // let showPage = false;
    // let loading = true;

    const accessPage = async () => {

        if (props === "checkLogin") {
            const res = await customFetch("/api/v1/authorizeLogin", {
                method: "GET",
                "Content-Type": "application/json",
            });

            try {
                const data = await res.json();
                if (res.status === 200) {
                    setShowPage(true);
                }
                else {
                    toast.error(data.message);
                }
                setLoading(false)
            } catch (error) {
                console.log(error);
            }

        } else if (props === "checkSeller") {
            const res = await customFetch("/api/v1/authorizeRoleSeller", {
                method: "GET",
                "Content-Type": "application/json",
            });

            try {
                const data = await res.json();
                if (res.status === 200) {
                    setShowPage(true);
                }
                else {
                    toast.error(data.message);
                }
                setLoading(false)
            } catch (error) {
                console.log(error);
            }
        }

    };


    useEffect(() => {
        accessPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);


    return { showPage, loading }

}

export default useAuthorize;